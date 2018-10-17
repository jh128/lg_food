const posModel = require('../models/position.model')
const moment = require('moment')
const fs = require('fs')
const path = require('path')

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var client = null

io.on('connection', function (socket) {
  client = socket
});

server.listen(8081, '10.9.164.98');

const save = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  req.body.createTime = moment().format('YYYY-MM-DD h:mm')
  req.body.companyLogo = req.filename
  const result = await posModel.save(req.body)
  if (result) {
    client.emit('message', result)
    res.render('position', {ret: true, data: JSON.stringify({msg: 'succ'})})
  } else {
    res.render('position', {ret: false, data: JSON.stringify({msg: 'fail'})})
  }
}

const findAll = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  const result = await posModel.findAll()
  res.send(result)
}

const find = async (req, res, next) => {
  console.log(0);
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  const {start, count} = req.query
  console.log(start, count);
  const data = await posModel.find({start, count})
  res.render('position', {ret: true, data: JSON.stringify(data)})
}

const findById = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  const result = await posModel.findById(req.params.id)
  res.render('position', {ret: true, data: JSON.stringify(result)})
}

const remove = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  const {id, filename} = req.body
  fs.unlink(path.resolve(__dirname, '../public/uploads/', filename), async (err) => {
    if (err) {
      res.send({ret: false, data: {msg: '删除失败!'}})
    }
    const result = await posModel.remove(id)
    res.send({ret: true, data: result})
  })
}

const update = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  req.body.createTime = moment().format('YYYY-MM-DD h:mm')
  req.body.companyLogo = req.filename || req.body.filename
  let id = req.body.id
  // delete req.body.id
  // delete req.body.filename
  const result = await posModel.update({...req.body, id: null, filename: null}, id)
  if (result) {
    res.render('position', {ret: true, data: JSON.stringify({msg: 'succ'})})
  } else {
    res.render('position', {ret: false, data: JSON.stringify({msg: 'fail'})})
  }
}

const findByKeywords = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf8')
  const {keywords, start, count} = req.body
  const data = await posModel.findByKeywords({keywords, start, count})
  res.render('position', {ret: true, data: JSON.stringify(data)})
}

module.exports = {
  save,
  findAll,
  remove,
  findById,
  update,
  find,
  findByKeywords
}
