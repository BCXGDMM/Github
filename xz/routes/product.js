const express=require('express');
const pool=require('../pool.js');
const queryString=require('querystring');
var router=express.Router();
//商品列表
router.get('/list',(req,res)=>{
	var obj=req.query;
	var $pno=obj.pno;
	var $size=obj.size;
	if(!$pno) $pno=1;
	if(!$size) $size=10;
	$pno=parseInt($pno);
	$size=parseInt($size);
	var start=($pno-1)*$size;
	pool.query('SELECT * FROM xz_laptop LIMIT ?,?',
		[start,$size],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send(result);
		}else{
			res.send({code:301,msg:'list err'});
		}
	});
});
//商品添加
router.get('/add',(req,res)=>{
	var obj=req.query;
	var $code=400;
	for(var key in obj){
		$code++;
		if(!obj[key]){
			res.send({code:$code,msg:key+' required'});
			return;
		}
	}
	pool.query('INSERT INTO xz_laptop SET ?',[obj]
		,(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'add suc'});
		}else{
			res.send({code:301,msg:'add err'});
		}
	});
});
//商品删除
router.get('/delete',(req,res)=>{
	var obj=req.query;
	if(!obj.lid){
		res.send({code:401,msg:'lid required'});
		return;
	}
	pool.query('DELETE FROM xz_laptop WHERE lid=?',[obj.lid]
		,(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'delete suc'});
		}else{
			res.send({code:301,msg:'delete err'});
		}
	});
});
//商品检索
router.get('/detail',(req,res)=>{
	var obj=req.query;
	if(!obj.lid){
		res.send({code:401,msg:'lid required'});
		return;
	}
	pool.query('SELECT * FROM xz_laptop WHERE lid=?',
		[obj.lid],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send(result);
		}else{
			res.send({code:301,msg:'detail err'});
		}
	});
});
//商品修改

router.get('/update',(req,res)=>{
	var obj=req.query;
	var $code=400;
	for(var key in obj){
		$code++;
		if(!obj[key]){
			res.send({code:$code,msg:key+' required'});
			return;
		}
		
	}
	pool.query('UPDATE xz_laptop SET title=?,subtitle=?,price=?,lname=?,memory=? WHERE lid=?',
			[obj.title,obj.subtitle,obj.price,obj.lname,obj.memory,obj.lid],(err,result)=>{
			if(err){
				throw err};
			if(result.affectedRows>0){
				 res.send({code:200,msg:'update suc'});
			}else{
				 res.send({code:301,msg:'update err'});
			}
	});
})
module.exports=router;
//lid family_id title subtitle price promise
//spec   lname  os  memory  resolution  video_card
//cpu   video_memory  category   disk  details