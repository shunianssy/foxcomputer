# Prefix (前缀) 技术

## 概述

Prefix（前缀）是提示工程（Prompt Engineering）和自然语言处理中的核心概念之一。它指的是在输入文本前添加的引导性文本，用于引导模型生成符合预期的输出。Prefix 技术广泛应用于大语言模型、代码生成、文本分类等多种场景。

## 核心概念

### 什么是 Prefix？

```
┌─────────────────────────────────────────────────────────────┐
│                    Prefix 结构示意                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [Prefix]        +        [Input]        →        [Output] │
│   前缀引导               用户输入                  模型输出   │
│                                                             │
│   示例:                                                      │
│   "请将以下文本翻译成英文：" + "你好世界" → "Hello World"      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Prefix 的作用

1. **任务引导**：明确告诉模型要执行什么任务
2. **格式约束**：指定输出的格式和结构
3. **角色设定**：为模型设定特定的角色或身份
4. **上下文提供**：提供必要的背景信息

## Prefix 的类型

### 1. 任务型 Prefix

```python
"""
任务型 Prefix 示例
不同的任务使用不同的前缀
"""

# 翻译任务
TRANSLATION_PREFIX = "请将以下文本翻译成英文："

# 摘要任务
SUMMARY_PREFIX = "请为以下文章生成一段简洁的摘要："

# 问答任务
QA_PREFIX = "根据以下上下文回答问题："

# 代码生成任务
CODE_PREFIX = "请用 Python 实现以下功能："

# 情感分析任务
SENTIMENT_PREFIX = "请分析以下文本的情感倾向（正面/负面/中性）："


class TaskPrefixHandler:
    """
    任务型 Prefix 处理器
    """
    
    def __init__(self):
        # 预定义的任务前缀
        self.prefixes = {
            'translate': "请将以下文本翻译成{target_language}：",
            'summarize': "请为以下文章生成一段{length}的摘要：",
            'qa': "根据以下上下文回答问题：\n上下文：{context}\n问题：",
            'code': "请用{language}实现以下功能：",
            'sentiment': "请分析以下文本的情感倾向：",
            'classify': "请将以下文本分类到{categories}中的一个类别：",
        }
    
    def build_prompt(self, task_type: str, input_text: str, 
                     **kwargs) -> str:
        """
        构建带前缀的完整提示
        
        Args:
            task_type: 任务类型
            input_text: 输入文本
            **kwargs: 前缀模板中的变量
            
        Returns:
            完整的提示文本
        """
        if task_type not in self.prefixes:
            raise ValueError(f"未知的任务类型: {task_type}")
            
        prefix_template = self.prefixes[task_type]
        prefix = prefix_template.format(**kwargs)
        
        return f"{prefix}\n{input_text}"


# 使用示例
if __name__ == "__main__":
    handler = TaskPrefixHandler()
    
    # 翻译任务
    prompt = handler.build_prompt(
        'translate',
        "人工智能正在改变世界",
        target_language="英文"
    )
    print(f"翻译提示:\n{prompt}\n")
    
    # 摘要任务
    prompt = handler.build_prompt(
        'summarize',
        "这是一篇很长的文章..." * 10,
        length="简洁"
    )
    print(f"摘要提示:\n{prompt}\n")
```

### 2. 角色型 Prefix

```python
"""
角色型 Prefix 示例
为模型设定特定的角色身份
"""

# 预定义角色
ROLE_PREFIXES = {
    'expert': """你是一位经验丰富的{domain}专家，拥有深厚的理论知识和实践经验。
请以专业、准确的方式回答问题，并在适当的时候提供深入的解释。""",
    
    'teacher': """你是一位耐心的{subject}老师，擅长用简单易懂的方式解释复杂概念。
请用循序渐进的方式教学，确保学生能够理解每个步骤。""",
    
    'assistant': """你是一个友好的AI助手，致力于帮助用户解决问题。
请保持礼貌、耐心，并提供有用的建议。""",
    
    'coder': """你是一位资深软件工程师，精通多种编程语言和最佳实践。
请编写清晰、高效、可维护的代码，并添加必要的注释。""",
    
    'reviewer': """你是一位严谨的代码审查专家，擅长发现潜在问题和改进空间。
请仔细审查代码，指出问题并提供具体的改进建议。"""
}


class RolePrefixHandler:
    """
    角色型 Prefix 处理器
    """
    
    def __init__(self):
        self.roles = ROLE_PREFIXES.copy()
        
    def add_role(self, role_name: str, prefix: str):
        """添加自定义角色"""
        self.roles[role_name] = prefix
        
    def build_system_prompt(self, role: str, **kwargs) -> str:
        """
        构建系统提示
        
        Args:
            role: 角色名称
            **kwargs: 模板变量
            
        Returns:
            系统提示文本
        """
        if role not in self.roles:
            raise ValueError(f"未知的角色: {role}")
            
        return self.roles[role].format(**kwargs)
    
    def build_full_prompt(self, role: str, user_input: str, 
                          **kwargs) -> tuple:
        """
        构建完整的对话提示
        
        Returns:
            (system_prompt, user_message)
        """
        system_prompt = self.build_system_prompt(role, **kwargs)
        return system_prompt, user_input


# 使用示例
if __name__ == "__main__":
    handler = RolePrefixHandler()
    
    # 专家角色
    system_prompt, user_msg = handler.build_full_prompt(
        'expert',
        "什么是机器学习中的过拟合？",
        domain="机器学习"
    )
    print(f"系统提示:\n{system_prompt}\n")
    print(f"用户消息:\n{user_msg}\n")
```

### 3. 格式型 Prefix

```python
"""
格式型 Prefix 示例
指定输出的格式和结构
"""

# JSON 格式输出
JSON_FORMAT_PREFIX = """请以 JSON 格式输出结果，格式如下：
{
    "result": "结果内容",
    "confidence": "置信度(0-1)",
    "reasoning": "推理过程"
}

输入："""

# Markdown 格式输出
MARKDOWN_FORMAT_PREFIX = """请以 Markdown 格式输出，包含以下部分：
## 概述
## 详细说明
## 示例
## 注意事项

输入："""

# 表格格式输出
TABLE_FORMAT_PREFIX = """请以表格形式输出结果，格式如下：
| 项目 | 描述 | 备注 |
|------|------|------|
| ... | ... | ... |

输入："""

# 步骤格式输出
STEP_FORMAT_PREFIX = """请按步骤输出解决方案，格式如下：
步骤1: ...
步骤2: ...
步骤3: ...

输入："""


class FormatPrefixHandler:
    """
    格式型 Prefix 处理器
    """
    
    def __init__(self):
        self.formats = {
            'json': JSON_FORMAT_PREFIX,
            'markdown': MARKDOWN_FORMAT_PREFIX,
            'table': TABLE_FORMAT_PREFIX,
            'steps': STEP_FORMAT_PREFIX,
        }
        
    def build_prompt(self, format_type: str, input_text: str) -> str:
        """构建带格式约束的提示"""
        if format_type not in self.formats:
            raise ValueError(f"未知的格式类型: {format_type}")
            
        return f"{self.formats[format_type]}{input_text}"
    
    def add_custom_format(self, format_name: str, 
                          format_template: str):
        """添加自定义格式"""
        self.formats[format_name] = format_template
```

### 4. Few-shot Prefix（少样本前缀）

```python
"""
Few-shot Prefix 示例
通过示例引导模型理解任务
"""

class FewShotPrefixHandler:
    """
    Few-shot Prefix 处理器
    通过提供示例来引导模型
    """
    
    def __init__(self):
        self.examples = {}
        
    def add_examples(self, task_type: str, 
                     examples: list):
        """
        添加示例
        
        Args:
            task_type: 任务类型
            examples: 示例列表 [{"input": ..., "output": ...}, ...]
        """
        self.examples[task_type] = examples
        
    def build_prompt(self, task_type: str, 
                     new_input: str,
                     max_examples: int = 3) -> str:
        """
        构建 Few-shot 提示
        
        Args:
            task_type: 任务类型
            new_input: 新的输入
            max_examples: 最大示例数量
            
        Returns:
            完整的 Few-shot 提示
        """
        if task_type not in self.examples:
            return new_input
            
        examples = self.examples[task_type][:max_examples]
        
        # 构建示例部分
        example_text = ""
        for i, ex in enumerate(examples, 1):
            example_text += f"示例{i}:\n"
            example_text += f"输入: {ex['input']}\n"
            example_text += f"输出: {ex['output']}\n\n"
            
        # 添加新输入
        example_text += f"请根据以上示例处理以下输入:\n输入: {new_input}\n输出:"
        
        return example_text


# 使用示例
if __name__ == "__main__":
    handler = FewShotPrefixHandler()
    
    # 添加情感分析示例
    handler.add_examples('sentiment', [
        {"input": "这个产品太棒了！", "output": "正面"},
        {"input": "服务态度很差，不会再来了。", "output": "负面"},
        {"input": "今天天气一般。", "output": "中性"},
    ])
    
    # 构建提示
    prompt = handler.build_prompt(
        'sentiment',
        "这家餐厅的菜品很美味，但价格有点贵。"
    )
    print(prompt)
```

## Prefix Tuning（前缀调优）

### 概念介绍

Prefix Tuning 是一种参数高效的微调方法，通过在输入前添加可学习的连续向量（软提示）来适应特定任务，而无需修改模型参数。

```
┌─────────────────────────────────────────────────────────────┐
│                  Prefix Tuning 架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   传统微调: 修改所有模型参数                                  │
│   ┌─────────────────────────────────────────┐               │
│   │  模型参数 (全部更新)                      │               │
│   └─────────────────────────────────────────┘               │
│                                                             │
│   Prefix Tuning: 只训练前缀向量                              │
│   ┌──────┐┌─────────────────────────────────┐               │
│   │前缀   ││  模型参数 (冻结)                 │               │
│   │向量   ││                                 │               │
│   │(训练) ││                                 │               │
│   └──────┘└─────────────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Prefix Tuning 实现

```python
"""
Prefix Tuning 实现
"""
import torch
import torch.nn as nn
from typing import Optional

class PrefixEncoder(nn.Module):
    """
    Prefix Encoder
    将离散的前缀索引映射为连续向量
    """
    
    def __init__(self, 
                 prefix_length: int,
                 hidden_size: int,
                 num_layers: int,
                 prefix_dropout: float = 0.1):
        """
        初始化 Prefix Encoder
        
        Args:
            prefix_length: 前缀长度（token 数量）
            hidden_size: 隐藏层维度
            num_layers: 模型层数
            prefix_dropout: Dropout 概率
        """
        super().__init__()
        self.prefix_length = prefix_length
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # 前缀嵌入参数
        # 每层都需要 key 和 value 的前缀
        self.prefix_embeddings = nn.Parameter(
            torch.randn(prefix_length, num_layers * 2, hidden_size)
        )
        
        # Dropout
        self.dropout = nn.Dropout(prefix_dropout)
        
        # 可选：使用 MLP 进行映射
        self.use_mlp = True
        if self.use_mlp:
            self.mlp = nn.Sequential(
                nn.Linear(hidden_size, hidden_size * 4),
                nn.Tanh(),
                nn.Linear(hidden_size * 4, num_layers * 2 * hidden_size)
            )
            
    def forward(self, batch_size: int) -> torch.Tensor:
        """
        生成前缀向量
        
        Args:
            batch_size: 批次大小
            
        Returns:
            前缀向量 [batch, prefix_len, num_layers * 2, hidden_size]
        """
        if self.use_mlp:
            # 使用 MLP 映射
            prefix_tokens = self.mlp(self.prefix_embeddings)
            prefix_tokens = prefix_tokens.view(
                self.prefix_length, 
                self.num_layers * 2, 
                self.hidden_size
            )
        else:
            prefix_tokens = self.prefix_embeddings
            
        # 扩展批次维度
        prefix_tokens = prefix_tokens.unsqueeze(0).expand(batch_size, -1, -1, -1)
        
        # 应用 Dropout
        prefix_tokens = self.dropout(prefix_tokens)
        
        return prefix_tokens


class PrefixTuningModel(nn.Module):
    """
    Prefix Tuning 模型包装器
    """
    
    def __init__(self, 
                 base_model,
                 prefix_length: int = 10,
                 prefix_dropout: float = 0.1):
        """
        初始化 Prefix Tuning 模型
        
        Args:
            base_model: 基础预训练模型
            prefix_length: 前缀长度
            prefix_dropout: Dropout 概率
        """
        super().__init__()
        self.base_model = base_model
        self.prefix_length = prefix_length
        
        # 冻结基础模型参数
        for param in self.base_model.parameters():
            param.requires_grad = False
            
        # 获取模型配置
        self.hidden_size = base_model.config.hidden_size
        self.num_layers = base_model.config.num_hidden_layers
        
        # 创建 Prefix Encoder
        self.prefix_encoder = PrefixEncoder(
            prefix_length=prefix_length,
            hidden_size=self.hidden_size,
            num_layers=self.num_layers,
            prefix_dropout=prefix_dropout
        )
        
    def forward(self, input_ids: torch.Tensor, 
                attention_mask: Optional[torch.Tensor] = None,
                **kwargs):
        """
        前向传播
        
        Args:
            input_ids: 输入 token IDs
            attention_mask: 注意力掩码
            
        Returns:
            模型输出
        """
        batch_size = input_ids.shape[0]
        
        # 生成前缀向量
        past_key_values = self.prefix_encoder(batch_size)
        
        # 扩展注意力掩码
        if attention_mask is not None:
            prefix_attention_mask = torch.ones(
                batch_size, self.prefix_length,
                device=attention_mask.device
            )
            attention_mask = torch.cat([
                prefix_attention_mask, attention_mask
            ], dim=1)
            
        # 调用基础模型
        outputs = self.base_model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            past_key_values=past_key_values,
            **kwargs
        )
        
        return outputs
    
    def get_trainable_parameters(self):
        """获取可训练参数"""
        return [p for p in self.parameters() if p.requires_grad]
    
    def print_trainable_parameters(self):
        """打印可训练参数数量"""
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        total = sum(p.numel() for p in self.parameters())
        print(f"可训练参数: {trainable:,} / {total:,} ({100 * trainable / total:.2f}%)")


# 使用示例
if __name__ == "__main__":
    # 示例：需要加载实际模型
    # from transformers import AutoModelForCausalLM, AutoTokenizer
    # 
    # base_model = AutoModelForCausalLM.from_pretrained("gpt2")
    # model = PrefixTuningModel(base_model, prefix_length=10)
    # model.print_trainable_parameters()
    pass
```

## Prompt Prefix vs Soft Prefix

| 特性 | Prompt Prefix (硬提示) | Soft Prefix (软提示) |
|------|----------------------|---------------------|
| 形式 | 离散文本 | 连续向量 |
| 可优化 | 否 | 是 |
| 可解释性 | 高 | 低 |
| 灵活性 | 低 | 高 |
| 训练成本 | 无 | 需要训练 |
| 适用场景 | 通用 | 特定任务 |

## 实际应用示例

### 1. 构建智能助手

```python
"""
智能助手 Prefix 配置
"""

class IntelligentAssistant:
    """
    智能助手类
    整合多种 Prefix 技术
    """
    
    def __init__(self, llm_client):
        """
        初始化助手
        
        Args:
            llm_client: LLM 客户端
        """
        self.llm = llm_client
        
        # 系统提示前缀
        self.system_prefix = """你是一个智能助手，具备以下能力：
1. 回答问题和提供信息
2. 分析和解决问题
3. 生成创意内容
4. 编写和审查代码

请根据用户的需求提供专业、准确、有帮助的回答。"""
        
        # 任务前缀模板
        self.task_prefixes = {
            'analyze': "\n请分析以下内容：\n",
            'explain': "\n请解释以下概念：\n",
            'solve': "\n请解决以下问题：\n",
            'create': "\n请创建以下内容：\n",
            'review': "\n请审查以下内容：\n",
        }
        
    def chat(self, user_input: str, task_type: str = None) -> str:
        """
        进行对话
        
        Args:
            user_input: 用户输入
            task_type: 任务类型（可选）
            
        Returns:
            助手回复
        """
        # 构建消息
        messages = [
            {"role": "system", "content": self.system_prefix}
        ]
        
        # 添加任务前缀
        if task_type and task_type in self.task_prefixes:
            user_input = self.task_prefixes[task_type] + user_input
            
        messages.append({"role": "user", "content": user_input})
        
        # 调用 LLM
        response = self.llm.chat(messages)
        
        return response
    
    def analyze_code(self, code: str) -> str:
        """代码分析"""
        prefix = """请从以下几个方面分析以下代码：
1. 代码质量和可读性
2. 潜在的 bug 和问题
3. 性能优化建议
4. 安全性考虑

代码：
"""
        return self.llm.chat([
            {"role": "system", "content": self.system_prefix},
            {"role": "user", "content": prefix + code}
        ])
    
    def generate_documentation(self, code: str) -> str:
        """生成文档"""
        prefix = """请为以下代码生成详细的文档说明，包括：
1. 功能描述
2. 参数说明
3. 返回值说明
4. 使用示例

代码：
"""
        return self.llm.chat([
            {"role": "system", "content": self.system_prefix},
            {"role": "user", "content": prefix + code}
        ])
```

### 2. 多语言翻译系统

```python
"""
多语言翻译 Prefix 配置
"""

class TranslationSystem:
    """
    多语言翻译系统
    使用 Prefix 引导翻译任务
    """
    
    def __init__(self, llm_client):
        self.llm = llm_client
        
        # 语言代码映射
        self.languages = {
            'zh': '中文',
            'en': '英文',
            'ja': '日文',
            'ko': '韩文',
            'fr': '法文',
            'de': '德文',
            'es': '西班牙文',
        }
        
        # 翻译风格前缀
        self.styles = {
            'formal': "请使用正式、专业的语言风格进行翻译。",
            'casual': "请使用轻松、口语化的语言风格进行翻译。",
            'academic': "请使用学术、严谨的语言风格进行翻译。",
            'literary': "请使用文学、优美的语言风格进行翻译。",
        }
        
    def translate(self, text: str, 
                  source_lang: str, 
                  target_lang: str,
                  style: str = 'formal') -> str:
        """
        执行翻译
        
        Args:
            text: 待翻译文本
            source_lang: 源语言代码
            target_lang: 目标语言代码
            style: 翻译风格
            
        Returns:
            翻译结果
        """
        # 构建前缀
        source = self.languages.get(source_lang, source_lang)
        target = self.languages.get(target_lang, target_lang)
        style_prefix = self.styles.get(style, self.styles['formal'])
        
        prefix = f"""你是一位专业的翻译专家。{style_prefix}

请将以下{source}文本翻译成{target}：
"""
        
        messages = [
            {"role": "user", "content": prefix + text}
        ]
        
        return self.llm.chat(messages)
    
    def batch_translate(self, texts: list, 
                        source_lang: str, 
                        target_lang: str) -> list:
        """批量翻译"""
        results = []
        for text in texts:
            result = self.translate(text, source_lang, target_lang)
            results.append(result)
        return results
```

## 最佳实践

### 1. Prefix 设计原则

```python
"""
Prefix 设计最佳实践
"""

# ✅ 好的 Prefix 设计
GOOD_PREFIXES = {
    'clear_task': "请将以下文本翻译成英文：",  # 任务明确
    'specific_format': "请用 JSON 格式输出，包含 name 和 age 字段：",  # 格式具体
    'with_example': "示例：输入'苹果'，输出'apple'。请翻译：",  # 提供示例
    'role_based': "作为一位资深翻译专家，请翻译：",  # 角色设定
}

# ❌ 不好的 Prefix 设计
BAD_PREFIXES = {
    'vague': "处理一下这个：",  # 任务模糊
    'no_guidance': "翻译",  # 缺乏引导
    'conflicting': "翻译成英文，然后总结，最后翻译回中文：",  # 任务冲突
}
```

### 2. Prefix 长度建议

```python
"""
Prefix 长度建议
"""

PREFIX_LENGTH_GUIDELINES = """
Prefix 长度建议：

1. 简单任务（翻译、分类）：10-30 tokens
   - "请将以下文本翻译成英文："

2. 复杂任务（推理、创作）：50-100 tokens
   - 包含详细说明和约束条件

3. Few-shot 任务：根据示例数量调整
   - 每个示例约 20-50 tokens

4. 角色扮演：30-100 tokens
   - 详细描述角色特征和能力

注意事项：
- 过长的 Prefix 会占用上下文窗口
- 过短的 Prefix 可能引导不足
- 平衡信息量和效率
"""
```

### 3. Prefix 模板管理

```python
"""
Prefix 模板管理器
"""

class PrefixTemplateManager:
    """
    Prefix 模板管理器
    统一管理和维护 Prefix 模板
    """
    
    def __init__(self):
        self.templates = {}
        self.version_history = {}
        
    def register(self, name: str, template: str, 
                 description: str = ""):
        """
        注册模板
        
        Args:
            name: 模板名称
            template: 模板内容
            description: 模板描述
        """
        self.templates[name] = {
            'template': template,
            'description': description,
            'version': 1
        }
        self.version_history[name] = [template]
        
    def get(self, name: str, **kwargs) -> str:
        """
        获取并填充模板
        
        Args:
            name: 模板名称
            **kwargs: 模板变量
            
        Returns:
            填充后的模板
        """
        if name not in self.templates:
            raise ValueError(f"模板不存在: {name}")
            
        template = self.templates[name]['template']
        return template.format(**kwargs)
    
    def update(self, name: str, new_template: str):
        """更新模板"""
        if name not in self.templates:
            raise ValueError(f"模板不存在: {name}")
            
        self.templates[name]['template'] = new_template
        self.templates[name]['version'] += 1
        self.version_history[name].append(new_template)
        
    def list_templates(self) -> list:
        """列出所有模板"""
        return [
            {
                'name': name,
                'description': info['description'],
                'version': info['version']
            }
            for name, info in self.templates.items()
        ]


# 使用示例
if __name__ == "__main__":
    manager = PrefixTemplateManager()
    
    # 注册模板
    manager.register(
        'translate',
        "请将以下文本从{source}翻译成{target}：\n{text}",
        "通用翻译模板"
    )
    
    manager.register(
        'summarize',
        "请为以下文章生成{length}的摘要：\n{text}",
        "摘要生成模板"
    )
    
    # 使用模板
    prompt = manager.get(
        'translate',
        source="中文",
        target="英文",
        text="你好世界"
    )
    print(prompt)
```

## 参考资料

- [Prefix-Tuning: Optimizing Continuous Prompts for Generation (2021)](https://arxiv.org/abs/2101.00190)
- [The Power of Scale for Parameter-Efficient Prompt Tuning (2021)](https://arxiv.org/abs/2104.08691)
- [Prompt Programming for Large Language Models (2021)](https://arxiv.org/abs/2102.07350)
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022)](https://arxiv.org/abs/2201.11903)
