"""RAG检索器"""
from typing import List, Dict
from app.rag.vector_store import VectorStore
from app.rag.embedding import EmbeddingModel
from app.logging.logger import get_logger

logger = get_logger("retriever")


class Retriever:
    """RAG检索器"""
    
    def __init__(
        self,
        vector_store: VectorStore = None,
        embedding_model: EmbeddingModel = None
    ):
        self.vector_store = vector_store or VectorStore()
        self.embedding_model = embedding_model or EmbeddingModel()
        logger.info("检索器初始化完成")
    
    async def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        """检索相关文档"""
        logger.info("执行检索", query=query, top_k=top_k)
        
        # 生成查询嵌入
        query_embedding = self.embedding_model.encode_single(query).tolist()
        
        # 向量检索
        results = self.vector_store.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        # 格式化结果
        formatted_results = []
        if results["documents"] and len(results["documents"]) > 0:
            for i in range(len(results["documents"][0])):
                formatted_results.append({
                    "content": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                    "score": 1 - results["distances"][0][i] if results["distances"] else 0.0
                })
        
        logger.info("检索完成", count=len(formatted_results))
        return formatted_results

