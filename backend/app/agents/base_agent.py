"""Agent基类"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseAgent(ABC):
    """Agent基类，所有Agent必须实现"""
    
    @abstractmethod
    async def analyze(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """执行分析任务"""
        pass
    
    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """返回Agent能力列表"""
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        """返回Agent名称"""
        pass

