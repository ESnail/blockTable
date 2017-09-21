#固定表格

**支持表格固定头部、左侧列、底部**

**使用**

1. 引入jQuery
2. 引入blocked_table.js及blocked_table.css
3. 将表格结构、样式正常的渲染完成
4. 调用
```javascript
    // 调用
    BlockTable({
        id: '', // 表格table的id值
        cellWidth: 100, // 表格每个单元格的宽度，默认100
        otherCellWidth: {0:70}， // 特殊设置的列及宽，需要在原有表格中的th列中设置宽度
        scrollHeight: 250, // 表格的高度
        leftFix: 3, // 左侧固定的列数
        width: 'auto' // 不设置，则默认平铺父级容器；设置则不平铺
    });
```

**效果**

![效果图](https://raw.githubusercontent.com/ESnail/blockTable/master/demo.gif)