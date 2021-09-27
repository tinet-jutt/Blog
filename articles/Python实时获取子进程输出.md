# Python实时获取输出

#### python print 介绍

>python中的print语句就是调用了sys.stdout.write(),例如在打印对象调用print(obj) 时，事实上是调用了 sys.stdout.write(obj+'\n');
默认以\n换行结束，可通过设置参数 end 参数选择结束符号。通常设置 end=' '实现单行覆盖输出。

#### python中输出规则
>python中标准错误（std.err）和标准输出(std.out)的输出规则（标准输出默认需要缓存后再输出到屏幕，而标准错误则直接打印到屏幕）

新建 system_time.py

```python
# !/usr/bin/python3
# -*- coding: utf-8 -*-
import datetime
import time

for line in range(0, 3):
    print(datetime.datetime.now().strftime("%H:%M:%S"))
    if line == 2:
        break
    time.sleep(1)

```
新建 result_output.py
```python
# !/usr/bin/python3
# -*- coding: utf-8 -*-
import subprocess
res = subprocess.Popen(["/usr/bin/python3 ./system_time.py"],
                       shell=True,
                       stdout=subprocess.PIPE,
                       stderr=subprocess.PIPE)
while res.poll() is None:
    print(res.stdout.readline())
```


>执行`python3 result_output.py`发现一次性输出3次时间


原因是python缓存机制，虽然stderr和stdout默认都是指向屏幕的，但是stderr是无缓存的，程序往stderr输出一个字符，就会在屏幕上显示一个；而stdout是有缓存的，只有遇到换行或者积累到一定的大小，才会显示出来。这就是为什么上面的会最先显示两个stderr的原因。

- -u参数

python命令加上-u（unbuffered）参数后会强制其标准输出也同标准错误一样不通过缓存直接打印到屏幕。
```python
python3 -u app.py
```

- print方法flush=True

flush=True可将缓存里面的内容立即输出到标准输出流。

```
print(datetime.datetime.now().strftime("%H:%M:%S"), flush=True)
```



