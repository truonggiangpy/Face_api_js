const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
require('./database');
const Task = require('./model/task')

const init = async () => {
    const server = new Hapi.Server({
        port: 3000,
        host: 'localhost'
    });
    await server.register({
        plugin: require('hapi-cors'),
        options: {
          origins: ['http://localhost:8080']
        }
      })
    server.route({// tao raw
        method: 'POST',
        path: '/tasks',
        options: {
            validate:{
                payload: Joi.object({
                    id: Joi.number(),
                    ten: Joi.string(),
                    lop: Joi.string(),
                    gioitinh: Joi.bool(),
                    khoa: Joi.string(),
                    ngaysinh: Joi.date(),
                    ngaynhaphoc: Joi.date()
                }),
                failAction: (request, h, error) => {
                    return error.isJoi 
                    ? h.response(error.details[0]).takeover()
                    : getComputedStyle,response(error).takeover()
                }
            }
        },
        handler: async (request, h) => {
            try {
                const task = new Task(request.payload);
                const taskSaved = await task.save();
                return h.response(taskSaved)   
            } catch (error) {
                console.log(error)
            }
        }
    })

    server.route({// get all raw
        method: 'GET',
        path: '/tasks',
        handler: async  (request, h) => {
            try {
                const tasks = await Task.find();
                return h.response(tasks);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    })

    server.route({ // get bang id
        method: 'GET',
        path: '/tasks/{id}',
        handler: async (request, h) => {
            try {
                const task = await Task.findById(request.params.id);
                return h.response(task);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    });
    server.route({// update mot raw
        method: 'POST',
        path: '/tasks/update/{id}',
        handler: async (request, h) => {
            try {
                const audatedTask = await Task.findByIdAndUpdate(request.params.id,
                request.payload, {new: true})
                return h.response(audatedTask);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    })

    server.route({

        method: 'GET',
        path: '/task/delete/{id}',
        handler: async (request, h) => {
            try {
                const audatedTask = await Task.findByIdAndDelete(request.params.id);
                    return h.response(audatedTask);
            } catch (error) {
                return h.response(error).code(500);
            }
        }
    })
    await server.start();
    console.log('server running on port 3000')
}

init();