"""LLM调用工具（OpenAI格式）"""
from openai import AsyncOpenAI
from typing import Dict
from app.config import settings
from app.logging.logger import get_logger

logger = get_logger("llm_tool")


class LLMTool:
    """LLM调用工具"""
    
    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or settings.LLM_API_KEY
        self.base_url = base_url or settings.LLM_BASE_URL
        self.model = settings.LLM_MODEL
        
        if self.api_key:
            self.client = AsyncOpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )
        else:
            self.client = None
            logger.warning("LLM API密钥未配置")
    
    def _build_prompt(self, context: Dict) -> str:
        """构建提示词"""
        prompt = f"""请分析以下充电数据，并总结问题：

数据摘要：
{context.get('dataframe_summary', {})}

关键信号：
{', '.join(context.get('key_signals', []))}

问题方向：
{context.get('problem_direction', '')}

相关知识：
{context.get('rag_knowledge', [])}

请提供：
1. 问题类型
2. 可能原因
3. 建议措施
"""
        return prompt
    
    async def summarize(self, context: Dict) -> str:
        """使用LLM总结问题"""
        if not self.client:
            logger.warning("LLM客户端未初始化，返回占位文本")
            return "LLM服务未配置，无法生成总结"
        
        prompt = self._build_prompt(context)
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "你是一个专业的充电系统分析专家。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            summary = response.choices[0].message.content
            logger.info("LLM总结完成")
            return summary
        except Exception as e:
            logger.error("LLM调用失败", error=str(e))
            return f"LLM调用失败: {str(e)}"

