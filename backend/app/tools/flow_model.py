"""1.5B流程控制模型工具"""
import pandas as pd
from typing import Dict, List
from app.config import settings
from app.logging.logger import get_logger

logger = get_logger("flow_model")


class FlowModelTool:
    """流程控制模型工具（1.5B本地模型）"""
    
    def __init__(self, model_path: str = None):
        self.model_path = model_path or settings.FLOW_MODEL_PATH
        self.model = None  # TODO: 加载模型
        logger.info("初始化流程控制模型", model_path=self.model_path)
    
    def _extract_features(self, df: pd.DataFrame) -> Dict:
        """提取DataFrame特征"""
        features = {}
        for col in df.columns:
            if col not in ['dt', 'ts']:
                features[f"{col}_mean"] = df[col].mean()
                features[f"{col}_std"] = df[col].std()
                features[f"{col}_max"] = df[col].max()
                features[f"{col}_min"] = df[col].min()
        return features
    
    async def determine_direction(self, df: pd.DataFrame) -> Dict:
        """确定问题大方向"""
        logger.info("流程模型确定问题方向")
        features = self._extract_features(df)
        
        # TODO: 调用1.5B模型进行推理
        # result = self.model.predict(features)
        
        # 占位实现
        return {
            "key_signals": ["BMS_DCChrgSt", "BMS_BattCurrt", "BMS_ChrgEndNum"],
            "problem_direction": "充电异常"
        }
    
    async def refine_problem(
        self,
        df: pd.DataFrame,
        rag_knowledge: List[Dict]
    ) -> Dict:
        """细化问题"""
        logger.info("流程模型细化问题")
        features = self._extract_features(df)
        context = self._prepare_context(rag_knowledge)
        
        # TODO: 调用1.5B模型进行推理
        # result = self.model.predict_with_context(features, context)
        
        # 占位实现
        return {
            "refined_signals": ["BMS_DCChrgSt", "BMS_BattCurrt"],
            "problem_type": "充电电流异常"
        }
    
    def _prepare_context(self, rag_knowledge: List[Dict]) -> str:
        """准备上下文"""
        context_parts = []
        for knowledge in rag_knowledge:
            context_parts.append(f"标题: {knowledge.get('title', '')}")
            context_parts.append(f"内容: {knowledge.get('content', '')}")
        return "\n".join(context_parts)

