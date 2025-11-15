"""ChromaDB向量存储"""
import chromadb
from chromadb.config import Settings
from typing import List, Dict
from app.config import settings
from app.logging.logger import get_logger

logger = get_logger("vector_store")


class VectorStore:
    """ChromaDB向量存储"""
    
    def __init__(self, persist_directory: str = None):
        self.persist_directory = persist_directory or settings.CHROMADB_PATH
        self.client = chromadb.PersistentClient(
            path=self.persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(
            name="charging_knowledge",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info("向量存储初始化完成", path=self.persist_directory)
    
    def add_documents(
        self,
        documents: List[str],
        metadatas: List[Dict],
        ids: List[str],
        embeddings: List[List[float]] = None
    ):
        """添加文档到向量库"""
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
        results = self.collection.query(
            query_embeddings=query_embeddings,
            n_results=n_results,
            where=where
        )
        return results
    
    def delete(self, ids: List[str]):
        """删除文档"""
        self.collection.delete(ids=ids)
        logger.info("删除文档", count=len(ids))

