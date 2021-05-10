# 克隆的仓库太大优化方案

### 1. 浅层克隆 ```--depth=n```
    n表示拉取最新的commit的次数

对比下
- 使用`git pull --depth=1`拉取的仓库用`git log`查看commit记录
```
* 64a5b4c - (grafted, HEAD -> dev, origin/dev, origin/HEAD) update (47 分钟前)
```

- 使用`git pull`拉取的仓库用`git log`查看commit记录
```
* 64a5b4c - (HEAD -> dev, origin/dev) update (2 小时前)
* b3326dc - heihei (5 小时前)
* 84dba47 - (reset) haha (5 小时前)
* a3748e9 - 还原A.txt (1 年 9 个月前)
* cfc063f - Revert "添加EEE" (1 年 9 个月前)
* eb283a6 - 添加EEE (1 年 9 个月前)
* a9bb437 - 添加ddd (1 年 9 个月前)
* 7ba2c82 - 修改 (1 年 9 个月前)
```

### 2. 只拉取指定文件或文件夹

1. 开启`Sparse Checkouts`
```bash
git config core.sparsecheckout true
```
2. 告诉git你想跟踪的文件或文件夹路径
```bash
# git 项目根目录下操作
# 只更新当前项目的contrib文件夹下的completion文件夹下的所有文件
echo contrib/completion/ >> .git/info/sparse-checkout
```
或者直接更改.git/info/sparse-checkout文件的内容也ok

**此方法针对一个git仓库存放了多个项目而本身只关注其中的某一个项目有奇效😄**