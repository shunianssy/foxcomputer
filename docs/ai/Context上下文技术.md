# Context（上下文）技术

## 概述

Context（上下文）是大语言模型（LLM）中的核心概念之一。它指的是模型在处理当前输入时能够参考的历史信息，包括对话历史、背景知识、系统提示等。上下文的设计和管理直接影响模型的输出质量和用户体验。

## 核心概念

### 什么是上下文？

```
┌─────────────────────────────────────────────────────────────┐
│                    上下文结构示意                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  上下文窗口                          │   │
│   │  ┌─────────┬─────────┬─────────┬─────────┬───────┐  │   │
│   │  │系统提示 │ 历史对话 │ 背景知识 │ 当前输入 │ 预留  │  │   │
│   │  │ System  │ History │Knowledge│  Input  │Output │  │   │
│   │  └─────────┴─────────┴─────────┴─────────┴───────┘  │   │
│   │                                                      │   │
│   │  ←───────────── 上下文长度限制 ──────────────────→   │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 上下文的组成要素

| 要素 | 说明 | 示例 |
|------|------|------|
| System Prompt | 系统级指令，定义模型行为 | "你是一个专业的翻译助手" |
| Conversation History | 对话历史记录 | 用户和助手的历史消息 |
| Background Knowledge | 背景知识/参考文档 | RAG 检索到的相关文档 |
| Current Input | 当前用户输入 | "请翻译这段文字" |
| Few-shot Examples | 少样本示例 | 输入输出示例对 |

## 上下文窗口

### 什么是上下文窗口？

上下文窗口是模型能够处理的最大 token 数量，不同模型有不同的限制：

| 模型 | 上下文窗口 | 特点 |
|------|-----------|------|
| GPT-3.5 | 4K / 16K | 基础版本 |
| GPT-4 | 8K / 32K | 更大窗口 |
| GPT-4 Turbo | 128K | 超长上下文 |
| Claude 2 | 100K | 长文本处理 |
| Claude 3 | 200K | 超长上下文 |
| Gemini 1.5 Pro | 1M | 百万级上下文 |

### 上下文长度计算

```python
"""
上下文长度计算与管理
"""
import tiktoken
from typing import List, Dict, Optional

class ContextManager:
    """
    上下文管理器
    管理和计算上下文长度
    """
    
    # 不同模型的编码器
    MODEL_ENCODINGS = {
        'gpt-3.5-turbo': 'cl100k_base',
        'gpt-4': 'cl100k_base',
        'gpt-4-turbo': 'cl100k_base',
        'text-davinci-003': 'p50k_base',
    }
    
    # 模型上下文限制
    MODEL_LIMITS = {
        'gpt-3.5-turbo': 4096,
        'gpt-3.5-turbo-16k': 16384,
        'gpt-4': 8192,
        'gpt-4-32k': 32768,
        'gpt-4-turbo': 128000,
        'claude-2': 100000,
        'claude-3': 200000,
    }
    
    def __init__(self, model: str = 'gpt-3.5-turbo'):
        """
        初始化上下文管理器
        
        Args:
            model: 模型名称
        """
        self.model = model
        self.encoding_name = self.MODEL_ENCODINGS.get(model, 'cl100k_base')
        self.encoding = tiktoken.get_encoding(self.encoding_name)
        self.max_tokens = self.MODEL_LIMITS.get(model, 4096)
        
    def count_tokens(self, text: str) -> int:
        """
        计算文本的 token 数量
        
        Args:
            text: 输入文本
            
        Returns:
            token 数量
        """
        return len(self.encoding.encode(text))
    
    def count_messages_tokens(self, messages: List[Dict]) -> int:
        """
        计算消息列表的 token 数量
        
        Args:
            messages: 消息列表 [{"role": "...", "content": "..."}]
            
        Returns:
            总 token 数量
        """
        # 每条消息的基础开销
        # role + content + 格式化开销
        tokens_per_message = 4  # <im_start>{role/name}\n{content}<im_end>\n
        tokens_per_name = -1    # 如果有 name 字段
        
        total_tokens = 3  # 消息列表的起始和结束标记
        
        for message in messages:
            total_tokens += tokens_per_message
            
            for key, value in message.items():
                total_tokens += self.count_tokens(str(value))
                if key == 'name':
                    total_tokens += tokens_per_name
                    
        return total_tokens
    
    def get_available_tokens(self, messages: List[Dict]) -> int:
        """
        获取剩余可用的 token 数量
        
        Args:
            messages: 当前消息列表
            
        Returns:
            剩余 token 数量
        """
        used = self.count_messages_tokens(messages)
        # 预留输出空间
        reserved_for_output = 500
        return max(0, self.max_tokens - used - reserved_for_output)
    
    def can_add_message(self, messages: List[Dict], 
                        new_message: Dict) -> bool:
        """
        检查是否可以添加新消息
        
        Args:
            messages: 当前消息列表
            new_message: 新消息
            
        Returns:
            是否可以添加
        """
        test_messages = messages + [new_message]
        return self.count_messages_tokens(test_messages) < self.max_tokens


# 使用示例
if __name__ == "__main__":
    manager = ContextManager('gpt-3.5-turbo')
    
    # 计算文本 token 数
    text = "你好，这是一段测试文本。"
    print(f"文本 token 数: {manager.count_tokens(text)}")
    
    # 计算消息 token 数
    messages = [
        {"role": "system", "content": "你是一个助手。"},
        {"role": "user", "content": "你好！"},
        {"role": "assistant", "content": "你好！有什么可以帮助你的？"},
    ]
    print(f"消息总 token 数: {manager.count_messages_tokens(messages)}")
    print(f"剩余可用 token: {manager.get_available_tokens(messages)}")
```

## 上下文管理策略

### 1. 滑动窗口策略

```python
"""
滑动窗口上下文管理
"""
from typing import List, Dict
from collections import deque

class SlidingWindowContext:
    """
    滑动窗口上下文管理器
    保留最近的 N 条消息
    """
    
    def __init__(self, 
                 max_messages: int = 10,
                 system_prompt: str = None):
        """
        初始化滑动窗口
        
        Args:
            max_messages: 最大保留消息数
            system_prompt: 系统提示
        """
        self.max_messages = max_messages
        self.system_prompt = system_prompt
        self.history = deque(maxlen=max_messages)
        
    def add_message(self, role: str, content: str):
        """添加消息到历史"""
        self.history.append({"role": role, "content": content})
        
    def get_context(self) -> List[Dict]:
        """获取完整上下文"""
        messages = []
        
        # 添加系统提示
        if self.system_prompt:
            messages.append({
                "role": "system",
                "content": self.system_prompt
            })
            
        # 添加历史消息
        messages.extend(list(self.history))
        
        return messages
    
    def clear(self):
        """清空历史"""
        self.history.clear()


# 使用示例
if __name__ == "__main__":
    context = SlidingWindowContext(
        max_messages=5,
        system_prompt="你是一个友好的助手。"
    )
    
    # 添加消息
    context.add_message("user", "你好")
    context.add_message("assistant", "你好！")
    context.add_message("user", "今天天气怎么样？")
    
    print(f"当前上下文: {context.get_context()}")
```

### 2. 摘要压缩策略

```python
"""
摘要压缩上下文管理
"""
from typing import List, Dict, Optional

class SummaryContextManager:
    """
    摘要压缩上下文管理器
    当上下文过长时，自动生成摘要
    """
    
    def __init__(self, 
                 llm_client,
                 max_tokens: int = 3000,
                 summary_threshold: float = 0.8):
        """
        初始化摘要管理器
        
        Args:
            llm_client: LLM 客户端
            max_tokens: 最大 token 数
            summary_threshold: 触发摘要的阈值比例
        """
        self.llm = llm_client
        self.max_tokens = max_tokens
        self.summary_threshold = summary_threshold
        self.history = []
        self.summary = None
        
    def add_message(self, role: str, content: str):
        """添加消息"""
        self.history.append({"role": role, "content": content})
        
        # 检查是否需要压缩
        if self._should_compress():
            self._compress()
            
    def _should_compress(self) -> bool:
        """检查是否需要压缩"""
        # 简化的 token 估算
        total_chars = sum(
            len(msg["content"]) for msg in self.history
        )
        estimated_tokens = total_chars // 4  # 粗略估算
        
        return estimated_tokens > self.max_tokens * self.summary_threshold
    
    def _compress(self):
        """压缩历史为摘要"""
        # 构建摘要提示
        history_text = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in self.history[:-2]  # 保留最近2条
        ])
        
        summary_prompt = f"""请将以下对话历史压缩为简洁的摘要，保留关键信息：

{history_text}

摘要："""

        # 生成摘要
        new_summary = self.llm.chat([
            {"role": "user", "content": summary_prompt}
        ])
        
        # 更新摘要并保留最近消息
        if self.summary:
            self.summary = f"{self.summary}\n\n新进展：{new_summary}"
        else:
            self.summary = new_summary
            
        # 只保留最近的消息
        self.history = self.history[-2:]
        
    def get_context(self, system_prompt: str = None) -> List[Dict]:
        """获取完整上下文"""
        messages = []
        
        # 添加系统提示
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
            
        # 添加摘要作为上下文
        if self.summary:
            messages.append({
                "role": "system",
                "content": f"对话历史摘要：{self.summary}"
            })
            
        # 添加最近消息
        messages.extend(self.history)
        
        return messages
```

### 3. 优先级截断策略

```python
"""
优先级截断上下文管理
"""
from typing import List, Dict, Tuple
from dataclasses import dataclass
from enum import Enum

class MessagePriority(Enum):
    """消息优先级"""
    CRITICAL = 0    # 必须保留（系统提示、关键指令）
    HIGH = 1        # 高优先级（最近的问题）
    MEDIUM = 2      # 中优先级（相关上下文）
    LOW = 3         # 低优先级（历史闲聊）


@dataclass
class PrioritizedMessage:
    """带优先级的消息"""
    message: Dict
    priority: MessagePriority
    token_count: int


class PriorityContextManager:
    """
    优先级截断上下文管理器
    根据优先级决定保留哪些消息
    """
    
    def __init__(self, 
                 max_tokens: int = 4000,
                 reserved_output: int = 500):
        """
        初始化优先级管理器
        
        Args:
            max_tokens: 最大 token 数
            reserved_output: 预留输出空间
        """
        self.max_tokens = max_tokens
        self.reserved_output = reserved_output
        self.available_tokens = max_tokens - reserved_output
        self.messages: List[PrioritizedMessage] = []
        
    def add_message(self, message: Dict, 
                    priority: MessagePriority = MessagePriority.MEDIUM,
                    token_count: int = None):
        """
        添加消息
        
        Args:
            message: 消息内容
            priority: 优先级
            token_count: token 数量（可选，会自动估算）
        """
        if token_count is None:
            # 简单估算
            token_count = len(message.get("content", "")) // 4
            
        self.messages.append(PrioritizedMessage(
            message=message,
            priority=priority,
            token_count=token_count
        ))
        
    def get_context(self) -> List[Dict]:
        """
        获取截断后的上下文
        按优先级保留消息
        """
        # 按优先级排序
        sorted_messages = sorted(
            self.messages,
            key=lambda x: x.priority.value
        )
        
        # 按优先级添加消息，直到达到限制
        result = []
        current_tokens = 0
        
        for pm in sorted_messages:
            if current_tokens + pm.token_count <= self.available_tokens:
                result.append(pm.message)
                current_tokens += pm.token_count
            else:
                # 尝试截断低优先级消息
                if pm.priority == MessagePriority.LOW:
                    continue
                    
        return result
    
    def get_stats(self) -> Dict:
        """获取统计信息"""
        return {
            "total_messages": len(self.messages),
            "total_tokens": sum(m.token_count for m in self.messages),
            "available_tokens": self.available_tokens,
            "priority_distribution": {
                p.name: sum(1 for m in self.messages if m.priority == p)
                for p in MessagePriority
            }
        }
```

## RAG 中的上下文管理

### 检索增强上下文

```python
"""
RAG 上下文管理
"""
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class RetrievedContext:
    """检索到的上下文"""
    content: str
    source: str
    relevance_score: float
    token_count: int


class RAGContextManager:
    """
    RAG 上下文管理器
    整合检索结果到上下文中
    """
    
    def __init__(self, 
                 llm_client,
                 retriever,
                 max_context_tokens: int = 3000,
                 max_retrieved_docs: int = 5):
        """
        初始化 RAG 上下文管理器
        
        Args:
            llm_client: LLM 客户端
            retriever: 检索器
            max_context_tokens: 最大上下文 token 数
            max_retrieved_docs: 最大检索文档数
        """
        self.llm = llm_client
        self.retriever = retriever
        self.max_context_tokens = max_context_tokens
        self.max_retrieved_docs = max_retrieved_docs
        
    def build_context(self, 
                      query: str,
                      conversation_history: List[Dict] = None,
                      system_prompt: str = None) -> List[Dict]:
        """
        构建完整的 RAG 上下文
        
        Args:
            query: 用户查询
            conversation_history: 对话历史
            system_prompt: 系统提示
            
        Returns:
            完整的消息列表
        """
        messages = []
        
        # 1. 添加系统提示
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
            
        # 2. 检索相关文档
        retrieved_docs = self._retrieve_documents(query)
        
        # 3. 构建知识上下文
        if retrieved_docs:
            knowledge_context = self._format_retrieved_docs(retrieved_docs)
            messages.append({
                "role": "system",
                "content": f"参考以下知识回答问题：\n\n{knowledge_context}"
            })
            
        # 4. 添加对话历史
        if conversation_history:
            messages.extend(conversation_history)
            
        # 5. 添加当前查询
        messages.append({
            "role": "user",
            "content": query
        })
        
        return messages
    
    def _retrieve_documents(self, query: str) -> List[RetrievedContext]:
        """检索相关文档"""
        # 调用检索器
        raw_results = self.retriever.search(query, k=self.max_retrieved_docs)
        
        # 转换为上下文对象
        contexts = []
        for doc, score in raw_results:
            contexts.append(RetrievedContext(
                content=doc['content'],
                source=doc.get('source', 'unknown'),
                relevance_score=score,
                token_count=len(doc['content']) // 4
            ))
            
        return contexts
    
    def _format_retrieved_docs(self, docs: List[RetrievedContext]) -> str:
        """格式化检索文档"""
        # 按相关性排序并截断
        total_tokens = 0
        formatted_docs = []
        
        for doc in sorted(docs, key=lambda x: x.relevance_score, reverse=True):
            if total_tokens + doc.token_count > self.max_context_tokens:
                break
                
            formatted_docs.append(
                f"【来源: {doc.source}】\n{doc.content}"
            )
            total_tokens += doc.token_count
            
        return "\n\n---\n\n".join(formatted_docs)
    
    def query(self, query: str, 
              conversation_history: List[Dict] = None,
              system_prompt: str = None) -> str:
        """
        执行 RAG 查询
        
        Args:
            query: 用户查询
            conversation_history: 对话历史
            system_prompt: 系统提示
            
        Returns:
            模型回复
        """
        messages = self.build_context(
            query=query,
            conversation_history=conversation_history,
            system_prompt=system_prompt
        )
        
        return self.llm.chat(messages)
```

## 多轮对话上下文

### 对话状态管理

```python
"""
多轮对话上下文管理
"""
from typing import List, Dict, Optional
from datetime import datetime
from dataclasses import dataclass, field
import json

@dataclass
class ConversationState:
    """对话状态"""
    conversation_id: str
    created_at: datetime
    messages: List[Dict] = field(default_factory=list)
    metadata: Dict = field(default_factory=dict)
    
    def to_dict(self) -> Dict:
        """转换为字典"""
        return {
            "conversation_id": self.conversation_id,
            "created_at": self.created_at.isoformat(),
            "messages": self.messages,
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'ConversationState':
        """从字典创建"""
        return cls(
            conversation_id=data["conversation_id"],
            created_at=datetime.fromisoformat(data["created_at"]),
            messages=data["messages"],
            metadata=data.get("metadata", {})
        )


class ConversationManager:
    """
    多轮对话管理器
    管理多个对话的上下文
    """
    
    def __init__(self, 
                 llm_client,
                 context_manager,
                 max_history_per_conversation: int = 50):
        """
        初始化对话管理器
        
        Args:
            llm_client: LLM 客户端
            context_manager: 上下文管理器
            max_history_per_conversation: 每个对话的最大历史数
        """
        self.llm = llm_client
        self.context_manager = context_manager
        self.max_history = max_history_per_conversation
        self.conversations: Dict[str, ConversationState] = {}
        
    def create_conversation(self, 
                            system_prompt: str = None,
                            metadata: Dict = None) -> str:
        """
        创建新对话
        
        Args:
            system_prompt: 系统提示
            metadata: 元数据
            
        Returns:
            对话 ID
        """
        import uuid
        conversation_id = str(uuid.uuid4())
        
        state = ConversationState(
            conversation_id=conversation_id,
            created_at=datetime.now(),
            metadata=metadata or {}
        )
        
        # 添加系统提示
        if system_prompt:
            state.messages.append({
                "role": "system",
                "content": system_prompt
            })
            
        self.conversations[conversation_id] = state
        return conversation_id
    
    def chat(self, conversation_id: str, 
             user_input: str) -> str:
        """
        在指定对话中发送消息
        
        Args:
            conversation_id: 对话 ID
            user_input: 用户输入
            
        Returns:
            助手回复
        """
        if conversation_id not in self.conversations:
            raise ValueError(f"对话不存在: {conversation_id}")
            
        state = self.conversations[conversation_id]
        
        # 添加用户消息
        state.messages.append({
            "role": "user",
            "content": user_input
        })
        
        # 获取上下文
        context = self.context_manager.get_context(state.messages)
        
        # 调用 LLM
        response = self.llm.chat(context)
        
        # 添加助手回复
        state.messages.append({
            "role": "assistant",
            "content": response
        })
        
        # 检查历史长度
        self._trim_history(state)
        
        return response
    
    def _trim_history(self, state: ConversationState):
        """修剪历史记录"""
        if len(state.messages) > self.max_history:
            # 保留系统提示和最近的对话
            system_messages = [
                m for m in state.messages if m["role"] == "system"
            ]
            other_messages = [
                m for m in state.messages if m["role"] != "system"
            ]
            
            # 只保留最近的消息
            other_messages = other_messages[-(self.max_history - len(system_messages)):]
            
            state.messages = system_messages + other_messages
            
    def get_conversation_history(self, 
                                  conversation_id: str) -> List[Dict]:
        """获取对话历史"""
        if conversation_id not in self.conversations:
            return []
        return self.conversations[conversation_id].messages
    
    def save_conversation(self, conversation_id: str, 
                          filepath: str):
        """保存对话到文件"""
        state = self.conversations.get(conversation_id)
        if state:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(state.to_dict(), f, ensure_ascii=False, indent=2)
                
    def load_conversation(self, filepath: str) -> str:
        """从文件加载对话"""
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        state = ConversationState.from_dict(data)
        self.conversations[state.conversation_id] = state
        return state.conversation_id
```

## 上下文优化技巧

### 1. 上下文压缩

```python
"""
上下文压缩技术
"""
from typing import List, Dict

def compress_context(messages: List[Dict], 
                     target_tokens: int,
                     llm_client) -> List[Dict]:
    """
    压缩上下文到目标 token 数
    
    Args:
        messages: 原始消息列表
        target_tokens: 目标 token 数
        llm_client: LLM 客户端
        
    Returns:
        压缩后的消息列表
    """
    # 分离系统消息和对话消息
    system_messages = [m for m in messages if m["role"] == "system"]
    conversation_messages = [m for m in messages if m["role"] != "system"]
    
    # 如果对话消息过长，生成摘要
    if len(conversation_messages) > 4:
        # 构建摘要提示
        history_text = "\n".join([
            f"{m['role']}: {m['content']}"
            for m in conversation_messages[:-2]
        ])
        
        summary_prompt = f"""请将以下对话压缩为简洁的摘要，保留关键信息：

{history_text}

摘要："""
        
        summary = llm_client.chat([
            {"role": "user", "content": summary_prompt}
        ])
        
        # 用摘要替换历史
        compressed = system_messages.copy()
        compressed.append({
            "role": "system",
            "content": f"对话历史摘要：{summary}"
        })
        compressed.extend(conversation_messages[-2:])
        
        return compressed
    
    return messages
```

### 2. 上下文缓存

```python
"""
上下文缓存
"""
from functools import lru_cache
from typing import List, Dict, Tuple
import hashlib

class ContextCache:
    """
    上下文缓存管理器
    缓存常用的上下文以减少计算
    """
    
    def __init__(self, max_cache_size: int = 100):
        """
        初始化缓存
        
        Args:
            max_cache_size: 最大缓存数量
        """
        self.cache = {}
        self.max_size = max_cache_size
        
    def _get_cache_key(self, messages: List[Dict]) -> str:
        """生成缓存键"""
        content = str(messages)
        return hashlib.md5(content.encode()).hexdigest()
    
    def get(self, messages: List[Dict]) -> Tuple[bool, any]:
        """
        获取缓存
        
        Args:
            messages: 消息列表
            
        Returns:
            (是否命中, 缓存内容)
        """
        key = self._get_cache_key(messages)
        if key in self.cache:
            return True, self.cache[key]
        return False, None
    
    def set(self, messages: List[Dict], result: any):
        """设置缓存"""
        if len(self.cache) >= self.max_size:
            # 简单的 FIFO 淘汰
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
            
        key = self._get_cache_key(messages)
        self.cache[key] = result
        
    def clear(self):
        """清空缓存"""
        self.cache.clear()
```

### 3. 动态上下文加载

```python
"""
动态上下文加载
"""
from typing import List, Dict, Callable, Optional

class DynamicContextLoader:
    """
    动态上下文加载器
    根据需要动态加载上下文
    """
    
    def __init__(self):
        self.context_providers: Dict[str, Callable] = {}
        
    def register_provider(self, name: str, 
                          provider: Callable[[], str]):
        """
        注册上下文提供者
        
        Args:
            name: 提供者名称
            provider: 提供者函数，返回上下文字符串
        """
        self.context_providers[name] = provider
        
    def load_context(self, provider_names: List[str]) -> str:
        """
        加载指定的上下文
        
        Args:
            provider_names: 要加载的提供者名称列表
            
        Returns:
            合并的上下文字符串
        """
        contexts = []
        
        for name in provider_names:
            if name in self.context_providers:
                context = self.context_providers[name]()
                contexts.append(f"【{name}】\n{context}")
                
        return "\n\n".join(contexts)
    
    def build_messages(self, 
                       base_messages: List[Dict],
                       context_providers: List[str]) -> List[Dict]:
        """
        构建带动态上下文的消息
        
        Args:
            base_messages: 基础消息列表
            context_providers: 上下文提供者名称列表
            
        Returns:
            完整的消息列表
        """
        dynamic_context = self.load_context(context_providers)
        
        if dynamic_context:
            # 在系统消息后插入动态上下文
            messages = base_messages.copy()
            
            # 找到系统消息的位置
            system_idx = next(
                (i for i, m in enumerate(messages) if m["role"] == "system"),
                0
            )
            
            # 插入动态上下文
            messages.insert(
                system_idx + 1,
                {"role": "system", "content": dynamic_context}
            )
            
            return messages
            
        return base_messages


# 使用示例
if __name__ == "__main__":
    loader = DynamicContextLoader()
    
    # 注册上下文提供者
    loader.register_provider(
        "current_time",
        lambda: f"当前时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )
    
    loader.register_provider(
        "user_info",
        lambda: "用户：张三，偏好：技术类内容"
    )
    
    # 加载上下文
    context = loader.load_context(["current_time", "user_info"])
    print(context)
```

## 最佳实践

### 1. 上下文设计原则

```
上下文设计原则：

1. 相关性：只包含与当前任务相关的信息
2. 简洁性：避免冗余，使用简洁的语言
3. 结构化：使用清晰的格式组织信息
4. 优先级：重要信息放在前面
5. 完整性：确保上下文信息完整，避免歧义
```

### 2. 常见问题与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 上下文过长 | 历史消息太多 | 使用滑动窗口或摘要压缩 |
| 回答不连贯 | 上下文丢失关键信息 | 增加摘要或关键信息提取 |
| 响应变慢 | 上下文处理开销大 | 使用缓存、减少上下文长度 |
| 偏离主题 | 无关信息干扰 | 提高检索精度、过滤无关内容 |

### 3. 上下文长度建议

```python
CONTEXT_LENGTH_RECOMMENDATIONS = """
上下文长度建议：

1. 简单问答：500-1000 tokens
   - 系统提示 + 当前问题

2. 多轮对话：2000-4000 tokens
   - 系统提示 + 对话历史（最近 5-10 轮）

3. RAG 应用：4000-8000 tokens
   - 系统提示 + 检索文档 + 对话历史

4. 长文档处理：10000+ tokens
   - 使用支持长上下文的模型
   - 分段处理 + 摘要整合

注意事项：
- 预留足够的输出空间（通常 500-1000 tokens）
- 监控实际 token 使用量
- 根据任务复杂度调整
"""
```

## 参考资料

- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022)](https://arxiv.org/abs/2201.11903)
- [Lost in the Middle: How Language Models Use Long Contexts (2023)](https://arxiv.org/abs/2307.03172)
- [Effective Context Window in Large Language Models (2023)](https://arxiv.org/abs/2305.18248)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
