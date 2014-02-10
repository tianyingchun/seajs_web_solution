# 用户自定义的 业务逻辑模块，因为业务逻辑模块不同于 seajs 模块，其变化相当快，不适合当成类似 JQUERY 功能插件来打包生成版本，这样
# 太过于复杂了。所以不放在sea-modules 目录里面。方便日后统一用SPM，Grunt构建工具 打包压缩发布
# 此文件 里面理论只包含纯的业务逻辑代码,  product,payment only used to test this demo.