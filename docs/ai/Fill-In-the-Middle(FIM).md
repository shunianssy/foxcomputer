# FIM (Fill-In-the-Middle) 中间填充技术

## 概述

FIM (Fill-In-the-Middle) 是一种让模型根据"前缀+后缀"上下文，预测并填充中间缺失内容的技术。这项技术最初由 DeepMind 在 2021 年提出，现已成为代码补全模型（如 GitHub Copilot、CodeLlama 等）的核心能力之一。

## 核心概念

### 什么是 FIM？

传统语言模型只能从左到右生成文本（因果语言模型），而 FIM 允许模型在已有上下文的中间进行填充：

```
前缀 (Prefix)    +    [待填充]    +    后缀 (Suffix)
     ↓                    ↓                   ↓
"def add(a, b):"    [模型生成]    "return result"
```

### FIM 的三种模式

```
┌─────────────────────────────────────────────────────────────┐
│                    FIM 模式对比                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  原始代码:                                                   │
│  def factorial(n):                                          │
│      if n <= 1:                                             │
│          return 1                                           │
│      return n * factorial(n - 1)                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PSM 模式 (Prefix-Suffix-Middle):                           │
│  <PRE> def factorial(n): <SUF> return n * factorial(n-1)    │
│        <MID> [模型预测中间内容]                               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SPM 模式 (Suffix-Prefix-Middle):                           │
│  <PRE> <SUF> return n * factorial(n-1) <MID>                │
│        def factorial(n): [模型预测中间内容]                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PS 模式 (Prefix-Suffix):                                   │
│  <PRE> def factorial(n): <SUF> return n * factorial(n-1)    │
│        [模型直接预测，无特殊分隔符]                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 训练数据构造

### FIM 训练样本生成

```python
"""
FIM 训练数据构造
"""
import random
from typing import Tuple, Optional
from dataclasses import dataclass

@dataclass
class FIMSample:
    """FIM 训练样本"""
    prefix: str           # 前缀文本
    middle: str           # 中间文本（目标）
    suffix: str           # 后缀文本
    formatted_input: str  # 格式化后的输入
    mode: str             # FIM 模式


class FIMDataConstructor:
    """
    FIM 训练数据构造器
    """
    
    # 特殊标记
    PRE_TOKEN = "<PRE>"
    SUF_TOKEN = "<SUF>"
    MID_TOKEN = "<MID>"
    EOT_TOKEN = "<EOT>"  # End of text
    
    def __init__(self, fim_rate: float = 0.5, 
                 psm_ratio: float = 0.5,
                 max_prefix_ratio: float = 0.6):
        """
        初始化 FIM 数据构造器
        
        Args:
            fim_rate: 使用 FIM 格式的概率
            psm_ratio: PSM 模式的比例（剩余为 SPM）
            max_prefix_ratio: 前缀最大占比
        """
        self.fim_rate = fim_rate
        self.psm_ratio = psm_ratio
        self.max_prefix_ratio = max_prefix_ratio
        
    def construct_sample(self, code: str, 
                         force_fim: bool = False) -> FIMSample:
        """
        构造单个 FIM 样本
        
        Args:
            code: 完整代码文本
            force_fim: 是否强制使用 FIM 格式
            
        Returns:
            FIMSample 对象
        """
        # 决定是否使用 FIM
        use_fim = force_fim or random.random() < self.fim_rate
        
        if not use_fim:
            # 不使用 FIM，直接返回原始代码
            return FIMSample(
                prefix="",
                middle=code,
                suffix="",
                formatted_input=code,
                mode="none"
            )
            
        # 随机分割点
        code_len = len(code)
        
        # 前缀分割点
        prefix_end = random.randint(1, int(code_len * self.max_prefix_ratio))
        
        # 后缀分割点（确保中间有内容）
        suffix_start = random.randint(prefix_end + 1, code_len)
        
        prefix = code[:prefix_end]
        middle = code[prefix_end:suffix_start]
        suffix = code[suffix_start:]
        
        # 选择 FIM 模式
        mode = "PSM" if random.random() < self.psm_ratio else "SPM"
        
        # 构造格式化输入
        if mode == "PSM":
            formatted = self._format_psm(prefix, suffix)
        else:
            formatted = self._format_spm(prefix, suffix)
            
        return FIMSample(
            prefix=prefix,
            middle=middle,
            suffix=suffix,
            formatted_input=formatted,
            mode=mode
        )
    
    def _format_psm(self, prefix: str, suffix: str) -> str:
        """
        PSM 模式格式化
        格式: <PRE> prefix <SUF> suffix <MID>
        """
        return f"{self.PRE_TOKEN}{prefix}{self.SUF_TOKEN}{suffix}{self.MID_TOKEN}"
    
    def _format_spm(self, prefix: str, suffix: str) -> str:
        """
        SPM 模式格式化
        格式: <PRE> <SUF> suffix <MID> prefix
        """
        return f"{self.PRE_TOKEN}{self.SUF_TOKEN}{suffix}{self.MID_TOKEN}{prefix}"
    
    def construct_batch(self, codes: list) -> list:
        """批量构造 FIM 样本"""
        return [self.construct_sample(code) for code in codes]


# 使用示例
if __name__ == "__main__":
    constructor = FIMDataConstructor(fim_rate=1.0, psm_ratio=0.5)
    
    code = '''def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
'''
    
    # 构造多个样本
    for i in range(3):
        sample = constructor.construct_sample(code)
        print(f"\n=== 样本 {i+1} ({sample.mode} 模式) ===")
        print(f"前缀: {sample.prefix[:50]}...")
        print(f"中间: {sample.middle[:50]}...")
        print(f"后缀: {sample.suffix[:50]}...")
        print(f"格式化输入: {sample.formatted_input[:80]}...")
```

## 模型训练

### FIM 损失函数

```python
"""
FIM 模型训练损失计算
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Optional

class FIMLoss(nn.Module):
    """
    FIM 训练损失
    只计算中间部分的损失
    """
    
    def __init__(self, pad_token_id: int, ignore_index: int = -100):
        super().__init__()
        self.pad_token_id = pad_token_id
        self.ignore_index = ignore_index
        
    def forward(self, logits: torch.Tensor, 
                labels: torch.Tensor,
                fim_mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        """
        计算 FIM 损失
        
        Args:
            logits: 模型输出 logits [batch, seq_len, vocab_size]
            labels: 标签 [batch, seq_len]
            fim_mask: FIM 区域掩码 [batch, seq_len]，True 表示需要计算损失
            
        Returns:
            损失值
        """
        # 移位：预测下一个 token
        shift_logits = logits[..., :-1, :].contiguous()
        shift_labels = labels[..., 1:].contiguous()
        
        # 计算交叉熵损失
        loss = F.cross_entropy(
            shift_logits.view(-1, shift_logits.size(-1)),
            shift_labels.view(-1),
            ignore_index=self.ignore_index,
            reduction='none'
        )
        
        # 重塑
        loss = loss.view(shift_labels.size())
        
        # 如果有 FIM 掩码，只计算 FIM 区域的损失
        if fim_mask is not None:
            shift_mask = fim_mask[..., 1:].contiguous()
            loss = loss * shift_mask.float()
            return loss.sum() / shift_mask.sum().clamp(min=1)
        
        return loss.mean()


class FIMTrainer:
    """
    FIM 模型训练器
    """
    
    def __init__(self, model, tokenizer, 
                 learning_rate: float = 1e-5,
                 fim_rate: float = 0.5):
        self.model = model
        self.tokenizer = tokenizer
        self.fim_rate = fim_rate
        
        self.optimizer = torch.optim.AdamW(
            model.parameters(), 
            lr=learning_rate
        )
        self.loss_fn = FIMLoss(pad_token_id=tokenizer.pad_token_id)
        
    def train_step(self, batch: dict) -> float:
        """
        单步训练
        
        Args:
            batch: 包含 input_ids, labels, fim_mask 的字典
            
        Returns:
            损失值
        """
        self.model.train()
        self.optimizer.zero_grad()
        
        # 前向传播
        outputs = self.model(
            input_ids=batch['input_ids'],
            attention_mask=batch['attention_mask']
        )
        
        # 计算损失
        loss = self.loss_fn(
            outputs.logits,
            batch['labels'],
            batch.get('fim_mask')
        )
        
        # 反向传播
        loss.backward()
        self.optimizer.step()
        
        return loss.item()
```

## 推理与补全

### FIM 推理实现

```python
"""
FIM 推理实现
"""
import torch
from typing import Optional, Tuple
from transformers import PreTrainedModel, PreTrainedTokenizer

class FIMCompleter:
    """
    FIM 代码补全器
    """
    
    def __init__(self, model: PreTrainedModel, 
                 tokenizer: PreTrainedTokenizer,
                 device: str = "cuda"):
        """
        初始化补全器
        
        Args:
            model: 预训练模型
            tokenizer: 分词器
            device: 运行设备
        """
        self.model = model.to(device)
        self.tokenizer = tokenizer
        self.device = device
        
        # FIM 特殊标记
        self.pre_token = "<PRE>"
        self.suf_token = "<SUF>"
        self.mid_token = "<MID>"
        self.eot_token = "<EOT>"
        
    def complete(self, prefix: str, suffix: str = "",
                 max_new_tokens: int = 256,
                 temperature: float = 0.8,
                 top_p: float = 0.95,
                 stop_tokens: list = None) -> str:
        """
        执行 FIM 补全
        
        Args:
            prefix: 前缀代码
            suffix: 后缀代码
            max_new_tokens: 最大生成 token 数
            temperature: 采样温度
            top_p: nucleus 采样参数
            stop_tokens: 停止标记列表
            
        Returns:
            补全的中间代码
        """
        self.model.eval()
        
        # 构造输入（PSM 模式）
        input_text = f"{self.pre_token}{prefix}{self.suf_token}{suffix}{self.mid_token}"
        
        # 编码
        input_ids = self.tokenizer.encode(
            input_text, 
            return_tensors="pt"
        ).to(self.device)
        
        # 生成
        with torch.no_grad():
            output_ids = self.model.generate(
                input_ids,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )
        
        # 解码
        output_text = self.tokenizer.decode(
            output_ids[0], 
            skip_special_tokens=False
        )
        
        # 提取中间部分
        middle = self._extract_middle(output_text, input_text)
        
        # 应用停止标记
        if stop_tokens:
            for stop in stop_tokens:
                if stop in middle:
                    middle = middle[:middle.index(stop)]
                    
        return middle
    
    def _extract_middle(self, output: str, input_text: str) -> str:
        """
        从输出中提取中间部分
        
        Args:
            output: 完整输出
            input_text: 输入文本
            
        Returns:
            中间部分文本
        """
        # 移除输入部分
        middle = output[len(input_text):]
        
        # 移除特殊标记
        for token in [self.eot_token, self.pre_token, self.suf_token, self.mid_token]:
            middle = middle.replace(token, "")
            
        return middle.strip()
    
    def complete_stream(self, prefix: str, suffix: str = "",
                        max_new_tokens: int = 256,
                        temperature: float = 0.8):
        """
        流式生成补全
        
        Yields:
            生成的 token
        """
        self.model.eval()
        
        input_text = f"{self.pre_token}{prefix}{self.suf_token}{suffix}{self.mid_token}"
        input_ids = self.tokenizer.encode(input_text, return_tensors="pt").to(self.device)
        
        past_key_values = None
        
        for _ in range(max_new_tokens):
            with torch.no_grad():
                outputs = self.model(
                    input_ids=input_ids if past_key_values is None else next_token.unsqueeze(0),
                    past_key_values=past_key_values,
                    use_cache=True
                )
                
            logits = outputs.logits[:, -1, :] / temperature
            probs = torch.softmax(logits, dim=-1)
            
            # 采样
            next_token = torch.multinomial(probs, num_samples=1)
            
            # 检查结束
            if next_token.item() == self.tokenizer.eos_token_id:
                break
                
            # 解码并 yield
            token_text = self.tokenizer.decode(next_token)
            yield token_text
            
            # 更新
            past_key_values = outputs.past_key_values
            input_ids = None


# 使用示例
if __name__ == "__main__":
    # 示例：需要加载实际模型
    # from transformers import AutoModelForCausalLM, AutoTokenizer
    # model = AutoModelForCausalLM.from_pretrained("codellama/CodeLlama-7b-hf")
    # tokenizer = AutoTokenizer.from_pretrained("codellama/CodeLlama-7b-hf")
    # completer = FIMCompleter(model, tokenizer)
    
    # prefix = "def calculate_average(numbers):\n    "
    # suffix = "    return total / len(numbers)"
    
    # middle = completer.complete(prefix, suffix)
    # print(f"补全结果:\n{middle}")
    pass
```

## 实际应用场景

### 1. IDE 代码补全

```python
"""
IDE 代码补全集成示例
"""
from dataclasses import dataclass
from typing import List, Optional
import re

@dataclass
class CompletionSuggestion:
    """补全建议"""
    text: str
    display_text: str
    score: float
    kind: str  # 'function', 'variable', 'snippet', etc.


class IDECodeCompleter:
    """
    IDE 代码补全器
    支持多种补全场景
    """
    
    def __init__(self, fim_completer, context_window: int = 2048):
        """
        初始化 IDE 补全器
        
        Args:
            fim_completer: FIM 补全模型
            context_window: 上下文窗口大小
        """
        self.fim = fim_completer
        self.context_window = context_window
        
    def complete_at_cursor(self, file_content: str, 
                           cursor_position: int,
                           file_path: str = "") -> List[CompletionSuggestion]:
        """
        在光标位置进行补全
        
        Args:
            file_content: 文件完整内容
            cursor_position: 光标位置
            file_path: 文件路径（用于上下文）
            
        Returns:
            补全建议列表
        """
        # 分割前后文
        prefix = file_content[:cursor_position]
        suffix = file_content[cursor_position:]
        
        # 截断过长的上下文
        prefix = self._truncate_prefix(prefix)
        suffix = self._truncate_suffix(suffix)
        
        # 获取补全
        completion = self.fim.complete(
            prefix=prefix,
            suffix=suffix,
            max_new_tokens=128,
            temperature=0.2
        )
        
        # 后处理
        completion = self._post_process(completion, prefix, suffix)
        
        return [
            CompletionSuggestion(
                text=completion,
                display_text=completion[:50] + "..." if len(completion) > 50 else completion,
                score=1.0,
                kind="snippet"
            )
        ]
    
    def complete_function(self, prefix: str) -> List[CompletionSuggestion]:
        """
        补全函数体
        """
        # 检测函数签名
        func_match = re.search(r'def\s+(\w+)\s*\([^)]*\)\s*(->\s*[\w\[\],\s]+)?\s*:\s*$', prefix)
        
        if not func_match:
            return []
            
        suggestions = []
        
        # 生成函数体
        completion = self.fim.complete(
            prefix=prefix,
            suffix="",
            max_new_tokens=256,
            temperature=0.3
        )
        
        suggestions.append(
            CompletionSuggestion(
                text=completion,
                display_text=f"函数体补全: {completion[:30]}...",
                score=0.9,
                kind="function"
            )
        )
        
        return suggestions
    
    def _truncate_prefix(self, prefix: str) -> str:
        """截断前缀以适应上下文窗口"""
        if len(prefix) <= self.context_window:
            return prefix
            
        # 尝试在完整行处截断
        truncated = prefix[-self.context_window:]
        newline_idx = truncated.find('\n')
        if newline_idx != -1:
            return truncated[newline_idx + 1:]
        return truncated
    
    def _truncate_suffix(self, suffix: str) -> str:
        """截断后缀"""
        max_suffix = self.context_window // 2
        if len(suffix) <= max_suffix:
            return suffix
        return suffix[:max_suffix]
    
    def _post_process(self, completion: str, prefix: str, suffix: str) -> str:
        """后处理补全结果"""
        # 移除与后缀重复的部分
        if suffix and completion.endswith(suffix[:20]):
            completion = completion[:-len(suffix[:20])]
            
        # 确保缩进正确
        prefix_indent = len(prefix) - len(prefix.rstrip(' \t'))
        lines = completion.split('\n')
        if lines:
            first_line_indent = len(lines[0]) - len(lines[0].lstrip(' \t'))
            if first_line_indent < prefix_indent:
                lines[0] = ' ' * prefix_indent + lines[0].lstrip()
                completion = '\n'.join(lines)
                
        return completion
```

### 2. 代码填充任务

```python
"""
代码填充任务示例
"""
from typing import List, Tuple

class CodeInfillingTask:
    """
    代码填充任务
    处理各种代码填充场景
    """
    
    def __init__(self, completer):
        self.completer = completer
        
    def fill_holes(self, code: str, holes: List[Tuple[int, int]]) -> str:
        """
        填充代码中的多个空洞
        
        Args:
            code: 包含空洞的代码
            holes: 空洞位置列表 [(start, end), ...]
            
        Returns:
            填充后的代码
        """
        result = code
        
        # 从后往前填充，避免位置偏移
        holes = sorted(holes, key=lambda x: x[0], reverse=True)
        
        for start, end in holes:
            prefix = result[:start]
            suffix = result[end:]
            
            # 填充
            filled = self.completer.complete(
                prefix=prefix,
                suffix=suffix,
                max_new_tokens=256,
                temperature=0.3
            )
            
            result = prefix + filled + suffix
            
        return result
    
    def fill_comment_placeholder(self, code: str) -> str:
        """
        填充注释占位符
        例如: # TODO: implement this
        """
        import re
        
        # 查找 TODO 注释
        pattern = r'#\s*TODO:\s*implement\s+.*'
        matches = list(re.finditer(pattern, code))
        
        if not matches:
            return code
            
        # 填充每个 TODO
        result = code
        for match in reversed(matches):
            start, end = match.start(), match.end()
            prefix = result[:start]
            suffix = result[end:]
            
            # 获取上下文信息
            context = self._extract_context(prefix)
            
            filled = self.completer.complete(
                prefix=prefix,
                suffix=suffix,
                max_new_tokens=128,
                temperature=0.3
            )
            
            result = prefix + filled + suffix
            
        return result
    
    def _extract_context(self, prefix: str) -> dict:
        """提取上下文信息"""
        lines = prefix.split('\n')
        context = {
            'last_line': lines[-1] if lines else '',
            'indent': len(lines[-1]) - len(lines[-1].lstrip()) if lines else 0
        }
        return context
```

## FIM 与其他技术的对比

| 特性 | FIM | 因果 LM | 掩码 LM |
|------|-----|---------|---------|
| 生成方向 | 中间填充 | 左到右 | 随机位置 |
| 上下文利用 | 双向 | 单向 | 双向 |
| 适用场景 | 代码补全 | 文本生成 | 理解任务 |
| 训练复杂度 | 中等 | 简单 | 中等 |
| 推理效率 | 较高 | 最高 | 较低 |

## 主流 FIM 模型

| 模型 | 发布时间 | 参数量 | 特点 |
|------|----------|--------|------|
| Codex | 2021 | 12B | OpenAI，GitHub Copilot 基础 |
| InCoder | 2022 | 6.7B | Meta，支持 FIM |
| CodeGen | 2022 | 16B | Salesforce，多语言 |
| CodeLlama | 2023 | 34B | Meta，Llama 代码版 |
| StarCoder | 2023 | 15B | BigCode，开源 |
| DeepSeek Coder | 2023 | 33B | 深度求索，高质量 |

## 最佳实践

### 1. 训练数据准备

```python
def prepare_fim_dataset(code_files: list, fim_rate: float = 0.5):
    """
    准备 FIM 训练数据集
    
    Args:
        code_files: 代码文件列表
        fim_rate: FIM 格式比例
        
    Returns:
        训练样本列表
    """
    constructor = FIMDataConstructor(fim_rate=fim_rate)
    samples = []
    
    for file_path in code_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            code = f.read()
            
        sample = constructor.construct_sample(code)
        samples.append(sample)
        
    return samples
```

### 2. 推理参数调优

```python
# 不同场景的推荐参数
INFERENCE_CONFIGS = {
    'precise': {
        'temperature': 0.2,
        'top_p': 0.9,
        'max_new_tokens': 128
    },
    'creative': {
        'temperature': 0.8,
        'top_p': 0.95,
        'max_new_tokens': 256
    },
    'fast': {
        'temperature': 0.1,
        'top_p': 0.8,
        'max_new_tokens': 64
    }
}
```

### 3. 质量评估

```python
def evaluate_fim_quality(model, test_cases: list):
    """
    评估 FIM 模型质量
    
    Args:
        model: FIM 模型
        test_cases: 测试用例 [(prefix, suffix, expected_middle), ...]
        
    Returns:
        评估指标
    """
    exact_match = 0
    total = len(test_cases)
    
    for prefix, suffix, expected in test_cases:
        predicted = model.complete(prefix, suffix)
        
        if predicted.strip() == expected.strip():
            exact_match += 1
            
    return {
        'exact_match_rate': exact_match / total,
        'total_cases': total
    }
```

## 参考资料

- [Efficient Training of Language Models to Fill in the Middle (2022)](https://arxiv.org/abs/2207.14255)
- [InCoder: A Generative Model for Code Infilling and Synthesis (2022)](https://arxiv.org/abs/2204.05999)
- [CodeLlama: Open Foundation Models for Code (2023)](https://arxiv.org/abs/2308.12950)
- [StarCoder: May the source be with you! (2023)](https://arxiv.org/abs/2305.06161)
- [DeepSeek-Coder: When the Large Language Model Meets Programming (2023)](https://arxiv.org/abs/2401.14189)
