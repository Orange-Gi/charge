"""BGE嵌入模型"""
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
from app.config import settings
from app.logging.logger import get_logger

logger = get_logger("embedding")


class EmbeddingModel:
    """BGE嵌入模型"""
    
    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.EMBEDDING_MODEL
        logger.info("加载嵌入模型", model_name=self.model_name)
        self.model = SentenceTransformer(self.model_name)
        logger.info("嵌入模型加载完成")
    
    def encode(self, texts: List[str], normalize: bool = True) -> np.ndarray:
        """生成文本嵌入"""
        embeddings = self.model.encode(
            texts,
            normalize_embeddings=normalize,
            show_progress_bar=False
        )
        return embeddings
    
    def encode_single(self, text: str, normalize: bool = True) -> np.ndarray:
        """生成单个文本嵌入"""
        return self.encode([text], normalize=normalize)[0]

