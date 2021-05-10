# npm 知识合集

- ### npm换源的几种方式
1. 使用nrm
    - 安装
    ```
    npm install -g nrm
    ```
    - 列出源的列表
    ```
    nrm ls
    ```
    - 输出结果
    ```
    * npm ---- https://registry.npmjs.org/
      cnpm --- http://r.cnpmjs.org/
      taobao - https://registry.npm.taobao.org/
      nj ----- https://registry.nodejitsu.com/
      rednpm - http://registry.mirror.cqupt.edu.cn/
      npmMirror  https://skimdb.npmjs.com/registry/
      edunpm - http://registry.enpmjs.org/
    ```
    - 使用
    ```
    nrm use taobao
    ```
2. 改变全局的注册
    - 设置成淘宝源
    ```
    npm config set registry https://registry.npm.taobao.org
    ```
    可使用`npm config set @myco:registry =<url register myco>`为不同包范围注册不同的包地址
    - 查看结果
    ```
    npm config get registry
    ```
    - 输出结果：
    ```
    https://registry.npm.taobao.org/
    ```
    测试一下(npm info [packageName] 查看指定包的详情)
    ```
    npm info vue
    ```
3. 在命令行里指定源
```
npm --registry https://registry.npm.taobao.org install [name]
```

4. 修改全局.npmrc 文件位于 ~/.npmrc
```
registry = https://registry.npm.taobao.org

```
为不同包范围注册不同的包地址
```
@myco:registry=<url register A>
registry=<url register B>
```
以@myco开头的包的注册地址是A,其余的包注册地址是B