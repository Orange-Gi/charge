"""RAG检索工具"""
from typing import List, Dict
from app.rag.retriever import Retriever
from app.logging.logger import get_logger

logger = get_logger("rag_tool")


class RAGTool:
    """RAG检索工具"""
    
    def __init__(self, retriever: Retriever = None):
        # 如果未提供retriever，则创建默认的
        if retriever is None:
            from app.rag.retriever import Retriever
            self.retriever = Retriever()
        else:
            self.retriever = retriever
    
    async def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        """检索相关知识"""
        logger.info("RAG检索", query=query, top_k=top_k)
        results = await self.retriever.retrieve(query, top_k)
        return results
    
    async def get_refined_signals(self, problem_direction: str) -> List[str]:
        """获取细化问题的关键信号"""
        query = f"针对{problem_direction}问题的关键信号"
        logger.info("获取细化信号", problem_direction=problem_direction)
        results = await self.retrieve(query, top_k=3)
        
        # 从结果中提取信号
        signals = []
        for result in results:
            # 假设结果中包含signals字段
            if "signals" in result:
                signals.extend(result["signals"])
        
        return signals[:3]  # 返回前3个信号

