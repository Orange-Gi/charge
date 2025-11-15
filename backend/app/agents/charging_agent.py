"""充电分析Agent（LangGraph实现）"""
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from app.agents.base_agent import BaseAgent
from app.tools.can_parser import CanParserTool
from app.tools.flow_model import FlowModelTool
from app.tools.rag_tool import RAGTool
from app.tools.llm_tool import LLMTool
from app.tools.report_generator import ReportGeneratorTool
from app.logging.logger import get_logger
import pandas as pd

logger = get_logger("charging_agent")


class ChargingAgentState(TypedDict):
    """充电分析Agent状态"""
    task_id: str
    file_path: str
    dataframe: pd.DataFrame
    key_signals: List[str]
    problem_direction: str
    rag_knowledge: List[Dict]
    refined_signals: List[str]
    iteration_count: int
    problem_summary: str
    report: str
    status: str
    error: str


class ChargingAgent(BaseAgent):
    """充电分析Agent"""
    
    def __init__(self):
        self.can_parser = CanParserTool()
        self.flow_model = FlowModelTool()
        self.rag_tool = RAGTool()
        self.llm_tool = LLMTool()
        self.report_generator = ReportGeneratorTool()
        self.workflow = self._create_workflow()
    
    def _create_workflow(self) -> StateGraph:
        """创建LangGraph工作流"""
        workflow = StateGraph(ChargingAgentState)
        
        # 添加节点
        workflow.add_node("parse_message", self._parse_message)
        workflow.add_node("flow_model_direction", self._flow_model_direction)
        workflow.add_node("rag_retrieval", self._rag_retrieval)
        workflow.add_node("flow_model_refine", self._flow_model_refine)
        workflow.add_node("llm_summary", self._llm_summary)
        workflow.add_node("generate_report", self._generate_report)
        
        # 设置入口
        workflow.set_entry_point("parse_message")
        
        # 添加边
        workflow.add_edge("parse_message", "flow_model_direction")
        workflow.add_edge("flow_model_direction", "rag_retrieval")
        workflow.add_edge("rag_retrieval", "flow_model_refine")
        
        # 条件边：最多迭代3次
        workflow.add_conditional_edges(
            "flow_model_refine",
            self._should_continue_refinement,
            {
                "continue": "flow_model_refine",
                "complete": "llm_summary"
            }
        )
        
        workflow.add_edge("llm_summary", "generate_report")
        workflow.add_edge("generate_report", END)
        
        return workflow.compile()
    
    async def _parse_message(self, state: ChargingAgentState) -> ChargingAgentState:
        """解析CAN报文"""
        logger.info("开始解析CAN报文", task_id=state["task_id"])
        df = await self.can_parser.parse(state["file_path"])
        state["dataframe"] = df
        state["status"] = "parsed"
        return state
    
    async def _flow_model_direction(self, state: ChargingAgentState) -> ChargingAgentState:
        """流程模型确定问题方向"""
        logger.info("流程模型确定问题方向", task_id=state["task_id"])
        result = await self.flow_model.determine_direction(state["dataframe"])
        state["key_signals"] = result["key_signals"]
        state["problem_direction"] = result["problem_direction"]
        state["status"] = "direction_determined"
        return state
    
    async def _rag_retrieval(self, state: ChargingAgentState) -> ChargingAgentState:
        """RAG检索"""
        logger.info("RAG检索相关知识", task_id=state["task_id"])
        # 检索相关知识
        knowledge = await self.rag_tool.retrieve(
            state["problem_direction"],
            top_k=5
        )
        # 获取细化问题的关键信号
        refined_signals = await self.rag_tool.get_refined_signals(
            state["problem_direction"]
        )
        state["rag_knowledge"] = knowledge
        state["refined_signals"] = refined_signals
        state["status"] = "rag_retrieved"
        return state
    
    async def _flow_model_refine(self, state: ChargingAgentState) -> ChargingAgentState:
        """流程模型细化问题"""
        logger.info("流程模型细化问题", task_id=state["task_id"], iteration=state["iteration_count"])
        state["iteration_count"] += 1
        result = await self.flow_model.refine_problem(
            state["dataframe"],
            state["rag_knowledge"]
        )
        state["refined_signals"] = result["refined_signals"]
        state["problem_direction"] = result["problem_type"]
        state["status"] = "refined"
        return state
    
    def _should_continue_refinement(self, state: ChargingAgentState) -> str:
        """判断是否继续细化"""
        # 最多迭代3次
        if state["iteration_count"] >= 3:
            return "complete"
        # 这里可以添加其他判断条件
        return "continue"
    
    async def _llm_summary(self, state: ChargingAgentState) -> ChargingAgentState:
        """LLM总结"""
        logger.info("LLM总结问题", task_id=state["task_id"])
        context = {
            "dataframe_summary": state["dataframe"].describe().to_dict(),
            "key_signals": state["key_signals"],
            "problem_direction": state["problem_direction"],
            "rag_knowledge": state["rag_knowledge"]
        }
        summary = await self.llm_tool.summarize(context)
        state["problem_summary"] = summary
        state["status"] = "summarized"
        return state
    
    async def _generate_report(self, state: ChargingAgentState) -> ChargingAgentState:
        """生成报告"""
        logger.info("生成分析报告", task_id=state["task_id"])
        report = await self.report_generator.generate(
            state["problem_summary"],
            {
                "key_signals": state["key_signals"],
                "problem_direction": state["problem_direction"],
                "dataframe": state["dataframe"]
            }
        )
        state["report"] = report
        state["status"] = "completed"
        return state
    
    async def analyze(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """执行分析"""
        initial_state: ChargingAgentState = {
            "task_id": data["task_id"],
            "file_path": data["file_path"],
            "dataframe": pd.DataFrame(),
            "key_signals": [],
            "problem_direction": "",
            "rag_knowledge": [],
            "refined_signals": [],
            "iteration_count": 0,
            "problem_summary": "",
            "report": "",
            "status": "pending",
            "error": ""
        }
        
        try:
            final_state = await self.workflow.ainvoke(initial_state)
            return {
                "status": "success",
                "result": final_state
            }
        except Exception as e:
            logger.error("分析失败", error=str(e), task_id=data["task_id"])
            return {
                "status": "error",
                "error": str(e)
            }
    
    def get_capabilities(self) -> List[str]:
        """返回能力列表"""
        return [
            "CAN报文解析",
            "充电问题诊断",
            "信号分析",
            "报告生成"
        ]
    
    def get_name(self) -> str:
        """返回Agent名称"""
        return "充电分析Agent"

