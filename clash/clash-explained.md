---
title: Clash 的工作原理
subtitle: 一个本地分流器：看域名、查规则、选出口
source: fake-ip · 规则表 · 代理组
cols: 3
---

Clash 跑在本机或路由器上，接管每个连接。它只回答一个问题：**直连、丢弃，还是交给节点**。答案来自一份有序的规则表。

## A 一个连接的一生

```flow TB
(App) -> DNS: ① 查域名
DNS -> [(fake-ip 表)]: 记下映射
App -> *Clash: ② 用假 IP 连接
Clash -> Sniff: ③ 从 SNI 还原域名
Sniff -> Rules: ④ 按域名匹配
Rules -> DIRECT & REJECT & *PROXY
PROXY -> Node: ⑤ 选中节点
Node -> Target: 代发真实连接
```

## B 为什么需要 fake-ip

系统只把目标 IP 交给程序，域名藏在 TLS 握手里。Clash 先发一个假 IP，把域名记下来。

| 请求 | DNS 返回 | 原因 |
| --- | --- | --- |
| 普通域名 | `198.18.0.1/16` 内的假 IP | 先占位，域名留在内存 |
| 命中 fake-ip-filter | 真实 IP | 这类名字必须本地可解析 |
| 直接写 IP | 不查询 | 没有域名可还 |

## C 规则：顺序就是优先级

Clash 从上往下读规则，第一条命中的决定出口。域名多来自 fake-ip 的还原结果。

| 规则 | 看什么 | 例子 |
| --- | --- | --- |
| DOMAIN / DOMAIN-SUFFIX / DOMAIN-KEYWORD | 域名 | `DOMAIN-SUFFIX,example.com` |
| IP-CIDR / GEOIP | 目标 IP 归属 | `GEOIP,CN` |
| DST-PORT / SRC-PORT | 端口 | `DST-PORT,22` |
| PROCESS-NAME | 发起连接的程序 | `PROCESS-NAME,curl` |
| MATCH | 兜底，永远命中 | `MATCH,PROXY` |

```yaml title="rules · 示意"
rules:
  - DOMAIN-SUFFIX,lan,DIRECT
  - DOMAIN-KEYWORD,ads,REJECT
  - DOMAIN-SUFFIX,example.com,PROXY
  - GEOIP,CN,DIRECT
  - MATCH,PROXY
```

## D 出口只有三种

| 出口 | Clash 做什么 | 隐藏本机 IP |
| --- | --- | --- |
| DIRECT | 本机直接建连 | no 目标看到真实 IP |
| REJECT | 立刻丢弃连接 | ok 连接不发出 |
| PROXY | 转交代理组 | ok 目标只看到节点 |

## E 代理组怎么挑节点

| 组类型 | 选谁 | 何时换 |
| --- | --- | --- |
| select | 你手动选的节点 | 只有你改 |
| url-test | 延迟最低的节点 | 最快节点快出 50ms |
| fallback | 列表里第一个活着的 | 前面的节点检查失败 |
| load-balance | 按目标地址哈希 | 目标不变就不换 |

健康检查默认每 300 秒跑一次。url-test 用 50ms 容差，节点不会来回跳。

## F 三种模式

| 模式 | 规则表 | 每个连接的结果 |
| --- | --- | --- |
| rule | 生效 | 按规则分流 |
| global | 跳过 | 全部走代理组 |
| direct | 跳过 | 全部直连 |

## G 代理那一跳做了什么

```sequence num
participants: 应用, Clash, 节点, 目标
应用 -> Clash: 明文请求
Clash -> 节点: 隧道，协议加密
节点 -> 目标: 真实连接
目标 --> 节点: 响应
节点 --> Clash: 隧道回包
Clash --> 应用: 响应
note Clash, 目标: TLS 端到端，Clash 不拆证书
```

## H 常见坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 局域网设备连不上 | 局域网域名被当成国外域名 | `DOMAIN-SUFFIX,lan` 放第一条 |
| 境外站走了直连 | 宽规则排在它前面 | 具体规则移到前面 |
| 节点来回切换 | url-test 容差太小 | 调大 tolerance |
| 广告还能打开 | 广告规则排在 MATCH 后面 | 移到 MATCH 前面 |
