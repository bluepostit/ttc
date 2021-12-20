const Auth = require('../auth')

async function routes (fastify, options) {
  const nodeNotFound = (path, reply) => {
    const response = {
      code: 404,
      error: `Node at '${path}' could not be found`
    }
    reply.send(JSON.stringify(response))
  }

  const loadDataNode = (request, reply) => {
    const path = request.params['*']
    request.log.info(`loadDataNode(${path})`)
    const node = request.dataTree.findNode(path) ||
      nodeNotFound(path, reply)

    return node
  }

  fastify.get('/handshake',
    {
      schema: {
        headers: { $ref: '/api/v1/ajax-headers#' }
      }
    },
    (request, reply) => {
      const data = {
        auth: {
          active: reply.locals.useAuth,
          signedIn: reply.locals.signedIn || false,
          versionInfo: request.versionInfo
        }
      }
      reply.send(JSON.stringify(data))
    }
  )

  fastify.post('/auth/login',
    {
      schema: {
        body: { $ref: '/auth/login#' }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body
      if (!email || !password) {
        throw fastify.httpErrors.badRequest('You must provide email and password')
      }

      if (!Auth.isCorrectEmail(email)) {
        throw fastify.httpErrors.unauthorized()
      }
      if (!await Auth.isCorrectPassword(password)) {
        throw fastify.httpErrors.unauthorized()
      }

      request.session.set('authenticated', true)
      fastify.log.info('successful authentication')
      reply.send(JSON.stringify({
        signedIn: true
      }))
    }
  )

  fastify.get('/auth/logout',
    (request, reply) => {
      if (request.session.get('authenticated')) {
        request.session.delete()
      }
      reply.send(JSON.stringify({}))
    }
  )

  fastify.get('/nodes',
    {
      preValidation: fastify.auth.ensureSignedIn,
      preHandler: [
        fastify.loadCacheDb,
        fastify.loadDataTreePreHandler
      ],
      schema: {
        headers: { $ref: '/api/v1/ajax-headers#' },
        response: {
          200: { $ref: '/api/v1/nodes.response.200#' }
        }
      }
    },
    (request, reply) => {
      const data = {
        nodes: request.dataTree
      }
      reply.send(JSON.stringify(data))
    }
  )

  fastify.get('/nodes/*',
    {
      preValidation: fastify.auth.ensureSignedIn,
      preHandler: [
        fastify.loadCacheDb,
        fastify.loadDataTreePreHandler
      ],
      schema: {
        headers: { $ref: '/api/v1/ajax-headers#' }
      }
    },
    (request, reply) => {
      const node = loadDataNode(request, reply)
      let response
      if (node && node.extension) {
        try {
          const path = request.params['*']
          const content = request.parseNodeFileContent(path)
          response = {
            content
          }
        } catch (e) {
          console.log(e)
          console.error('Failed reading file!')
          response = {
            code: 500,
            error: 'Error processing document'
          }
        }
      } else {
        response = node || null
      }
      reply.send(JSON.stringify(response))
    }
  )
}

module.exports = routes
