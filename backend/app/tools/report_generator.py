"""报告生成工具"""
from typing import Dict
from app.logging.logger import get_logger

logger = get_logger("report_generator")


class ReportGeneratorTool:
    """报告生成工具"""
    
    def _load_template(self) -> str:
        """加载报告模板"""
        template = """# 充电分析报告

## 问题概述
{summary}

## 关键信号分析
{key_signals_section}

## 问题诊断
{diagnosis}

## 建议措施
{recommendations}

## 数据统计
{statistics}
"""
        return template
    
    async def generate(self, summary: str, data: Dict) -> str:
        """生成Markdown格式报告"""
        logger.info("生成分析报告")
        
        template = self._load_template()
        
        # 格式化关键信号
        key_signals_section = "\n".join([
            f"- {signal}" for signal in data.get("key_signals", [])
        ])
        
        # 提取诊断和建议（从summary中解析或从data中获取）
        diagnosis = data.get("diagnosis", "待分析")
        recommendations = "\n".join([
            f"- {rec}" for rec in data.get("recommendations", ["待分析"])
        ])
        
        # 数据统计
        df = data.get("dataframe")
        if df is not None and not df.empty:
            statistics = f"""
- 数据点数: {len(df)}
- 时间范围: {df['ts'].min()} - {df['ts'].max()}
"""
        else:
            statistics = "无数据统计"
        
        report = template.format(
            summary=summary,
            key_signals_section=key_signals_section,
            diagnosis=diagnosis,
            recommendations=recommendations,
            statistics=statistics
        )
        
        logger.info("报告生成完成")
        return report

