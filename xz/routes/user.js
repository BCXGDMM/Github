const express=require('express');
const pool=require('../pool.js');
var router=express.Router();
//用户注册
router.post('/reg',function(req,res){
	var obj=req.body;
	console.log(obj);
	var $code=400;
 /*
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}
	if(!obj.email){
		res.send({code:403,msg:'email required'});
		return;
	}
	if(!obj.phone){
		res.send({code:404,msg:'phone required'});
		return;
	}
 */
	for(var key in obj){
		$code++;
		if(!obj[key]){
			res.send({code:$code,msg:key+' required'});
			return;
		}
	}
	pool.query('INSERT INTO xz_user SET ?',
		[obj],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'reg suc'});
		}else{
			res.send({code:405,msg:'reg err'});
		}
	})
});
//用户登录
router.post('/login',(req,res)=>{
	var obj=req.body;
	console.log(obj);
	var $code=400;
	for(var key in obj){
		$code++;
		if(!obj[key]){
			res.send({code:$code,msg:key+' required'});
		}
	}
	pool.query(`SELECT * FROM xz_user WHERE uname=? AND upwd=?`,
		[obj.uname,obj.upwd],(err,result)=>{
		if(err) throw err;
		if(result.length===0){
			res.send({code:++$code,msg:'login err'});
		}else{
			res.send({code:200,msg:'login is work'})
		}
	});
}); 
//用户检索
router.get('/detail',(req,res)=>{
	var obj=req.query;
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
		return;
	}
	pool.query('SELECT * FROM xz_user WHERE uid=?',
		[obj.uid],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send(result);
		}else{
			res.send({code:401,msg:'detail err'});
		}
	});
});
//用户修改
router.get('/update',(req,res)=>{
	var obj=req.query;
	var $code=400;
	for(var key in obj){
		$code++;
		var $gender=obj.gender;
		if(!obj[key]){
			res.send({code:$code,msg:key+' required'});
		}
		if($gender=='男'){
			$gender=1;
		}else if($gender='女'){
			$gender=0;
		}
	}
	pool.query('UPDATE xz_user SET email=?,phone=?,user_name=?,gender=? WHERE uid=?',
		[obj.email,obj.phone,obj.user_name,$gender,obj.uid],
		(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'update suc'});
		}else{
			res.send({code:++$code,msg:'update err'});
		}
	});
});
//用户列表
router.get('/list',(req,res)=>{
	var obj=req.query;
	var $pno=obj.pno;
	var $size=obj.size;
	if(!$pno) $pno=1;
	if(!$size) $size=3;
	$pno=parseInt($pno);
	$size=parseInt($size);
	var start=($pno-1)*$size;
	pool.query('SELECT * FROM xz_user LIMIT ?,?',
		[start,$size],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send(result);
		}else{
			res.send({code:301,msg:'list err'});
		}
	});
});
//删除用户
router.get('/delete',(req,res)=>{
	var obj=req.query;
	var $uid=parseInt(obj.uid);
		if(!obj.uid){
			res.send({code:401,msg:'uid required'});
			return;
		}
	pool.query('DELETE FROM xz_user WHERE uid=?',[$uid],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'delete suc'});
		}else{
			res.send({code:301,msg:'delete err'});
		}
	});
})

module.exports=router;