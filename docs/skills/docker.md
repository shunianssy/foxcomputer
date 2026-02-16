# Docker & Podman 命令速查手册

> 适用于新手和日常开发快速查找

---

## 目录

- [Docker 简介](#docker-简介)
- [安装与配置](#安装与配置)
- [镜像操作](#镜像操作)
- [容器操作](#容器操作)
- [网络操作](#网络操作)
- [数据卷操作](#数据卷操作)
- [Docker Compose](#docker-compose)
- [Podman 简介](#podman-简介)
- [Podman 常用命令](#podman-常用命令)
- [常见问题](#常见问题)

---

## Docker 简介

Docker 是一个开源的容器化平台，可以将应用程序及其依赖打包到一个可移植的容器中。

### 核心概念

| 概念 | 说明 |
|------|------|
| **镜像 (Image)** | 只读模板，包含创建容器的指令 |
| **容器 (Container)** | 镜像的运行实例，相互隔离 |
| **仓库 (Registry)** | 存储和分发镜像的地方 |
| **Dockerfile** | 构建镜像的文本文件 |

---

## 安装与配置

### Windows 安装 Docker Desktop

1. 下载 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. 安装并启动 Docker Desktop
3. 验证安装：

```bash
# 查看 Docker 版本
docker --version

# 查看 Docker 信息
docker info

# 运行测试容器
docker run hello-world
```

### 配置镜像加速

编辑 Docker Desktop 设置，添加国内镜像源：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

---

## 镜像操作

### 查找与获取镜像

```bash
# 搜索镜像
docker search nginx

# 拉取镜像（默认最新版）
docker pull nginx

# 拉取指定版本
docker pull nginx:1.24.0

# 拉取指定平台镜像
docker pull --platform linux/amd64 nginx
```

### 查看与管理镜像

```bash
# 查看本地镜像
docker images

# 查看镜像详细信息
docker inspect nginx:latest

# 查看镜像历史
docker history nginx:latest

# 删除镜像
docker rmi nginx:latest

# 强制删除镜像
docker rmi -f nginx:latest

# 清理悬空镜像（无标签的镜像）
docker image prune

# 清理所有未使用的镜像
docker image prune -a
```

### 构建镜像

```bash
# 使用 Dockerfile 构建镜像
docker build -t myapp:v1.0 .

# 指定 Dockerfile 路径
docker build -t myapp:v1.0 -f ./Dockerfile.prod .

# 构建时传递参数
docker build --build-arg NODE_ENV=production -t myapp:v1.0 .
```

### 镜像导入导出

```bash
# 导出镜像为 tar 文件
docker save -o nginx.tar nginx:latest

# 从 tar 文件导入镜像
docker load -i nginx.tar

# 导出镜像到标准输出
docker save nginx:latest | gzip > nginx.tar.gz
```

---

## 容器操作

### 创建与运行容器

```bash
# 运行容器（前台）
docker run nginx

# 运行容器（后台）
docker run -d nginx

# 运行并命名容器
docker run -d --name my-nginx nginx

# 运行并映射端口
docker run -d -p 8080:80 --name my-nginx nginx

# 运行并挂载目录
docker run -d -v /host/path:/container/path nginx

# 运行并设置环境变量
docker run -d -e MYSQL_ROOT_PASSWORD=123456 mysql

# 运行并限制资源
docker run -d --memory=512m --cpus=1 nginx

# 运行并自动重启
docker run -d --restart=always nginx

# 交互式运行容器
docker run -it ubuntu /bin/bash
```

### 查看容器状态

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看容器详细信息
docker inspect my-nginx

# 查看容器资源使用
docker stats my-nginx

# 查看容器端口映射
docker port my-nginx

# 查看容器进程
docker top my-nginx
```

### 容器生命周期管理

```bash
# 启动容器
docker start my-nginx

# 停止容器
docker stop my-nginx

# 重启容器
docker restart my-nginx

# 暂停容器
docker pause my-nginx

# 恢复容器
docker unpause my-nginx

# 删除容器
docker rm my-nginx

# 强制删除运行中的容器
docker rm -f my-nginx

# 删除所有停止的容器
docker container prune
```

### 进入容器

```bash
# 进入容器（推荐）
docker exec -it my-nginx /bin/bash

# 以 root 用户进入
docker exec -it -u 0 my-nginx /bin/bash

# 在容器中执行命令
docker exec my-nginx ls /etc/nginx

# 附加到容器主进程
docker attach my-nginx
```

### 查看容器日志

```bash
# 查看容器日志
docker logs my-nginx

# 实时查看日志
docker logs -f my-nginx

# 查看最近 100 行日志
docker logs --tail 100 my-nginx

# 查看指定时间段的日志
docker logs --since 2024-01-01 my-nginx
docker logs --since 2h my-nginx
```

### 容器与主机文件传输

```bash
# 从主机复制文件到容器
docker cp /host/file.txt my-nginx:/container/path/

# 从容器复制文件到主机
docker cp my-nginx:/container/file.txt /host/path/

# 复制整个目录
docker cp /host/dir my-nginx:/container/path/
```

---

## 网络操作

### 网络管理

```bash
# 查看网络列表
docker network ls

# 创建网络
docker network create my-network

# 创建指定子网的网络
docker network create --subnet=172.20.0.0/16 my-network

# 查看网络详情
docker network inspect my-network

# 删除网络
docker network rm my-network

# 清理未使用的网络
docker network prune
```

### 容器连接网络

```bash
# 运行时连接网络
docker run -d --network my-network nginx

# 将运行中的容器连接到网络
docker network connect my-network my-nginx

# 断开网络连接
docker network disconnect my-network my-nginx
```

---

## 数据卷操作

### 卷管理

```bash
# 查看所有卷
docker volume ls

# 创建卷
docker volume create my-volume

# 查看卷详情
docker volume inspect my-volume

# 删除卷
docker volume rm my-volume

# 清理未使用的卷
docker volume prune
```

### 使用卷

```bash
# 使用命名卷
docker run -d -v my-volume:/data nginx

# 使用主机目录（绑定挂载）
docker run -d -v /host/path:/container/path nginx

# 只读挂载
docker run -d -v my-volume:/data:ro nginx

# 匿名卷
docker run -d -v /data nginx
```

---

## Docker Compose

Docker Compose 用于定义和运行多容器应用。

### 基本命令

```bash
# 启动服务（后台）
docker-compose up -d

# 启动服务（前台）
docker-compose up

# 构建并启动
docker-compose up --build

# 停止服务
docker-compose down

# 停止并删除卷
docker-compose down -v

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 进入容器
docker-compose exec nginx bash
```

### docker-compose.yml 示例

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - app-network
    depends_on:
      - db
    restart: always

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: myapp
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-network
    restart: always

networks:
  app-network:
    driver: bridge

volumes:
  db-data:
```

---

## Podman 简介

Podman 是 Docker 的开源替代品，无需守护进程，更安全。

### Podman vs Docker

| 特性 | Docker | Podman |
|------|--------|--------|
| 架构 | 客户端-服务器（需要守护进程） | 无守护进程 |
| 权限 | 需要 root 或 docker 组 | 可以 rootless 运行 |
| 兼容性 | 原生 | 兼容 Docker 命令 |
| Pods | 不支持 | 原生支持 Pods |
| Systemd | 需要额外配置 | 原生集成 |

### Windows 安装 Podman

```powershell
# 使用 winget 安装
winget install RedHat.Podman

# 初始化 Podman 机器
podman machine init

# 启动 Podman 机器
podman machine start

# 查看 Podman 信息
podman info
```

---

## Podman 常用命令

Podman 命令与 Docker 高度兼容，大多数 Docker 命令可以直接替换 `docker` 为 `podman`。

### 镜像操作

```bash
# 搜索镜像
podman search nginx

# 拉取镜像
podman pull nginx

# 查看本地镜像
podman images

# 删除镜像
podman rmi nginx

# 构建镜像
podman build -t myapp:v1.0 .
```

### 容器操作

```bash
# 运行容器
podman run -d --name my-nginx -p 8080:80 nginx

# 查看容器
podman ps -a

# 进入容器
podman exec -it my-nginx bash

# 查看日志
podman logs my-nginx

# 停止容器
podman stop my-nginx

# 删除容器
podman rm my-nginx
```

### Pod 操作（Podman 特有）

```bash
# 创建 Pod
podman pod create --name my-pod -p 8080:80

# 查看 Pod
podman pod ls

# 在 Pod 中运行容器
podman run -d --pod my-pod --name web nginx

# 查看 Pod 详情
podman pod inspect my-pod

# 停止 Pod
podman pod stop my-pod

# 删除 Pod
podman pod rm my-pod
```

### Systemd 集成

```bash
# 生成 systemd 服务文件
podman generate systemd --name my-nginx --files

# 启用容器服务
systemctl --user enable container-my-nginx
```

### Podman Compose

```bash
# 安装 podman-compose
pip install podman-compose

# 使用 podman-compose
podman-compose up -d
podman-compose down
```

---

## 常见问题

### 如何查看容器 IP 地址？

```bash
# 方法一：inspect
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-nginx

# 方法二：进入容器查看
docker exec my-nginx hostname -i
```

### 如何清理 Docker 空间？

```bash
# 清理所有未使用的资源
docker system prune

# 清理所有（包括未使用的镜像）
docker system prune -a

# 清理并删除卷
docker system prune -a --volumes
```

### 如何修改容器配置？

```bash
# 停止容器
docker stop my-nginx

# 修改配置文件（需要 root 权限）
# 配置文件位置：/var/lib/docker/containers/<容器ID>/config.v2.json

# 重启 Docker 服务
systemctl restart docker

# 启动容器
docker start my-nginx
```

### 如何导出容器为镜像？

```bash
# 将容器保存为镜像
docker commit my-nginx my-nginx:v1.0

# 带作者和说明
docker commit -a "author" -m "message" my-nginx my-nginx:v1.0
```

### 如何解决权限问题？

```bash
# Docker 权限问题
sudo usermod -aG docker $USER

# Podman rootless 模式
podman system migrate
```

### 如何查看 Docker 磁盘使用？

```bash
# 查看磁盘使用
docker system df

# 查看详细信息
docker system df -v
```

### 如何调试容器网络？

```bash
# 创建调试容器
docker run -it --network my-network nicolaka/netshoot bash

# 在容器中使用网络工具
dig nginx
curl http://nginx
ping nginx
```

---

## 快速参考卡片

### Docker 常用命令

| 操作 | 命令 |
|------|------|
| 查看镜像 | `docker images` |
| 拉取镜像 | `docker pull 镜像名` |
| 删除镜像 | `docker rmi 镜像名` |
| 查看容器 | `docker ps -a` |
| 运行容器 | `docker run -d --name 名称 镜像` |
| 进入容器 | `docker exec -it 名称 bash` |
| 查看日志 | `docker logs 名称` |
| 停止容器 | `docker stop 名称` |
| 删除容器 | `docker rm 名称` |
| 清理空间 | `docker system prune` |

### Podman 常用命令

| 操作 | 命令 |
|------|------|
| 查看镜像 | `podman images` |
| 运行容器 | `podman run -d --name 名称 镜像` |
| 查看 Pod | `podman pod ls` |
| 创建 Pod | `podman pod create --name 名称` |
| 清理空间 | `podman system prune` |
