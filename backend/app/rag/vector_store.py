"""ChromaDB向量存储"""
import warnings
from typing import List, Dict, Optional
from app.config import settings
from app.logging.logger import get_logger

logger = get_logger("vector_store")

# 尝试导入 chromadb，如果失败则使用占位实现
_chromadb_available = False
try:
    import chromadb
    from chromadb.config import Settings
    _chromadb_available = True
except Exception as e:
    warnings.warn(f"ChromaDB 不可用: {e}. 将使用占位实现。", UserWarning)
    logger.warning("ChromaDB 不可用，使用占位实现", error=str(e))


class VectorStore:
    """ChromaDB向量存储（如果不可用则使用占位实现）"""
    
    def __init__(self, persist_directory: str = None):
        self.persist_directory = persist_directory or settings.CHROMADB_PATH
        if _chromadb_available:
            self.client = chromadb.PersistentClient(
                path=self.persist_directory,
                settings=Settings(anonymized_telemetry=False)
            )
            self.collection = self.client.get_or_create_collection(
                name="charging_knowledge",
                metadata={"hnsw:space": "cosine"}
            )
            logger.info("向量存储初始化完成", path=self.persist_directory)
        else:
            self.client = None
            self.collection = None
            logger.warning("向量存储使用占位实现", path=self.persist_directory)
    
    def add_documents(
        self,
        documents: List[str],
        metadatas: List[Dict],
        ids: List[str],
        embeddings: List[List[float]] = None
    ):
        """添加文档到向量库"""
        if not _chromadb_available or not self.collection:
            logger.warning("ChromaDB 不可用，跳过添加文档", count=len(documents))
            return
        if embeddings:
            self.collection.add(
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
        else:
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
        logger.info("添加文档到向量库", count=len(documents))
    
    def query(
        self,
        query_embeddings: List[List[float]],
        n_results: int = 5,
        where: Dict = None
    ) -> Dict:
        """查询相似文档"""
        if not _chromadb_available or not self.collection:
            logger.warning("ChromaDB 不可用，返回空结果")
            return {"documents": [], "metadatas": [], "distances": []}
        results = self.collection.query(
            query_embeddings=query_embeddings,
            n_results=n_results,
            where=where
        )
        return results
    
    def delete(self, ids: List[str]):
        """删除文档"""
        if not _chromadb_available or not self.collection:
            logger.warning("ChromaDB 不可用，跳过删除文档", count=len(ids))
            return
        self.collection.delete(ids=ids)
        logger.info("删除文档", count=len(ids))

