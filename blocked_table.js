/*
	//id: table id
	//cellwidth:单元格宽度
	//scrollHeight: 表格body 最大高度，超出最大高度进行纵向scroll，非必须
	//leftFix:左侧固定列数,大于等于1
	//width: 默认为空 auto:表示表格不进行自适应外层宽度

	blockTable({id:'blockTable',cellWidth:150,scrollHeight:300,leftFix:3});
	
	特殊说明：table必须有高度，hide的table没有高度

*/
(function (win) {
	var blockTable=function(settings){
		var tableId=settings.id,cellWidth=settings.cellWidth||100,
			leftFix=settings.leftFix,scrollHeight=settings.scrollHeight;
			width=settings.width||'';
		var otherCellWidthSet=settings.otherCellWidth||'';

		var marginTop=settings.marginTop||0;
		var horizontalTable=settings.horizontalTable||'',horizontalDisabled=settings.horizontalDisabled;
		var table=$('#'+tableId);
		var isMac=window.navigator.userAgent.indexOf("Mac OS")!=-1;

		var tableWidth=table.width();
		table.children('tfoot').addClass('hide-tfoot');
		var rootParent=table.parents('.blocked-table-wrapper'),
			nativeParent=table.parents('.blocked-table-native');

		// 删除table外层 blocked wrapper
		if(rootParent.length){
			rootParent.replaceWith(table[0].outerHTML);
		}

		table.wrap("<div id='blocked_"+tableId+"'class='blocked-table-wrapper'><div class='blocked-table-native'></div></div>");
		var rootParent=table.parents('.blocked-table-wrapper'),
			nativeParent=table.parents('.blocked-table-native');

		var theadDiv='<div class="blocked-table-thead clear"><div class="left-thead block-left"></div><div class=" table-wrap-reposition"><div class="thead block-right-content"></div></div></div>';
		var leftBodyDiv='<div class="blocked-table-tbody left-tbody block-left"><div class="tbody"></div></div>';
		var tfootDiv='<div class="blocked-table-tfoot clear"><div class="left-tfoot block-left"></div><div class=" table-wrap-reposition"><div class="tfoot block-right-content"></div></div></div>';
		var scrollXDiv='<div class="blocked-table-scrollX clear"><div class=" table-wrap-reposition"><div class="scroll-x block-right-content"></div></div></div>';

		// 定位 wrap
		table.wrap("<div class='table-wrap-reposition'><div class='table-wrap block-right-content'></div></div>");

		nativeParent.before(theadDiv);
		// body 左侧固定
		table.parents('.table-wrap-reposition').before(leftBodyDiv);
		//横向滚动条
		nativeParent.after(scrollXDiv);
		// tfoot
		nativeParent.after(tfootDiv);

		// thead 
		var theadThArr=table.children('thead').find('th');

		var theadHeight=table.children('thead').height(),
		cloneThead=table.children('thead').clone();

		rootParent.find(".thead").html("<table><thead>"+cloneThead.html()+"</thead></table>");
		if(isMac){
			rootParent.addClass('mac');
		}

		if(tableWidth>theadThArr.length*cellWidth&&width!='auto'){
			leftFix=0;
		}else{	
			var cellNumLength=theadThArr.length;
			var contentWidth=cellNumLength*cellWidth;
			var leftFixedWidth=leftFix*cellWidth;
			if (otherCellWidthSet){
				var tempWidth=0,leftFixWidthAdd=0,leftCellNum=0,tempCellNum=0,widthAdd=0;
				for(var i in otherCellWidthSet){
					if(i>=cellNumLength){
						break;
					}
					var w=Number(otherCellWidthSet[i]);
					tempCellNum++;
					// 计算所有单元格中指定宽度之和
					tempWidth+=w;
					if(i<leftFix){
						leftCellNum++;
						// 计算左侧指定单元格宽度之和
						leftFixWidthAdd+=w;
					}
					widthAdd+=(w-cellWidth);//指定单元格宽度值与全局单元格差量
				}
				contentWidth=contentWidth+widthAdd;
				cellWidth=(contentWidth-tempWidth)/(cellNumLength-tempCellNum);
				//左侧固定列之和的宽度：自定义宽度之和+其他自动均分单元格宽度之和
				leftFixedWidth=Math.ceil(leftFixWidthAdd+(leftFix-leftCellNum)*cellWidth);
			}
			//设置右侧内容的宽度 无限制
			// 设置所有右侧内容区域的宽度和display
			//rootParent.find(".block-right-content").css('display','inline-block').width(contentWidth);
			rootParent.find(".block-right-content").width(contentWidth);
			try{
				var offsetTarget=table.find('tr:first').find('th').eq(leftFix);
				var offsetLeft=0;
				if(offsetTarget.length){
					offsetLeft=offsetTarget.offset().left-table.offset().left;
				}
				if(leftFixedWidth<offsetLeft){
					leftFixedWidth=offsetLeft;
				}
			}catch(e){
				console.log('err');
			}

			var rightTargets=['thead','tfoot','tbody'];
			var leftTheadHtml = '', allTheadHtml = '';
			var leftTfootHtml = '', allTfootHtml = '';
			for(var i =0;i<rightTargets.length;i++){
				var item=rightTargets[i];
				var tableChildren=table.children(item);
				switch(item){
					case 'thead':
						tableChildren=table.children('thead');
						break;
					case 'tbody':
						tableChildren=table.children('tbody');
						break;
					case 'tfoot':
						tableChildren=table.children('tfoot');
						break;
				}
				
				if(tableChildren.length){
					var trArr=tableChildren.children('tr');
					var html=(getCellByTr(trArr,leftFix)).join('');
					var contentHtml=[];
					tableChildren.each(function(k,con){
						contentHtml.push($(con).html());
					});
					var leftHtml = '', allHtml = '';
					switch(item){
						case 'thead':
							leftTheadHtml = html;
							allTheadHtml = contentHtml;							
							leftHtml = '<'+item+'>'+html+'</'+item+'>';
							allHtml = '<'+item+'>'+contentHtml.join("")+'</'+item+'>';
							break;
						case 'tbody':
							leftHtml = '<thead>'+leftTheadHtml+'</thead><tbody>'+html+'</tbody>';
							allHtml = '<thead>'+allTheadHtml.join("")+'</thead><tbody>'+contentHtml.join("")+'</tbody>';
							break;
						case 'tfoot':
							leftTfootHtml = html;
							allTfootHtml = contentHtml;
							leftHtml = '<'+item+'>'+html+'</'+item+'>';
							allHtml = '<'+item+'>'+contentHtml.join("")+'</'+item+'>';
							break;
					}
					html&&rootParent.find('.left-'+item).html('<table>'+leftHtml+'</table>').width(leftFixedWidth);
					rootParent.find("."+item+'.block-right-content').html('<table>'+allHtml+'</'+item+'></table>');
				}
			}
			rootParent.find('.table-wrap-reposition')
				.css('margin-left',leftFixedWidth)
				.children().css('margin-left',-leftFixedWidth);
		}
		// tfoot
		nativeParent.css({'max-height':scrollHeight+'px'});

		// 将tbody的表头提高
		var headerHeight=rootParent.find('.blocked-table-thead').height()||0;
		
		nativeParent.find('.blocked-table-tbody,.table-wrap-reposition').css({"margin-top":-headerHeight});

		// 横向滚动
		rootParent.find(".blocked-table-scrollX .table-wrap-reposition").scroll(function(){
			var _this=$(this);
			var scrollLeft=_this.scrollLeft();
			var rootParent=_this.parents(".blocked-table-wrapper");
			
			rootParent.find(".table-wrap-reposition").not(this).scrollLeft(scrollLeft);
		});
		if(isMac){
			//mac pc scroll
			rootParent.find('.table-wrap-reposition').scroll(function(){
				var _this=$(this);
				var scrollLeft=_this.scrollLeft();
				setTimeout(function(){
					var rootParent=_this.parents(".blocked-table-wrapper");
					rootParent.find(".table-wrap-reposition").not(this).scrollLeft(scrollLeft);
				},1);
			});
		}
		function getCellByTr(trArr,leftFix){
			var arr=[];
			for(var i=0;i<trArr.length;i++){
				var item=$(trArr[i]);
				var tdArr=item.children('td,th'),tdStrArr=[];
				var num=0;
				for(var j=0;j<leftFix&&num<leftFix;j++,num++){
					var _td=$(tdArr[j]);
					var colspan=_td.attr('colspan');
					colspan&&colspan>1&&(num=num+colspan-1);
					;
					tdStrArr.push(tdArr[j].outerHTML);
				}
				var $tr = $(item.prop('outerHTML'));
				$tr.html(tdStrArr.join('')).css('height',item.height());
				arr.push($tr.prop('outerHTML'));
			}
			return arr;
		}
	};
	win.BlockTable = blockTable;
})(this);
