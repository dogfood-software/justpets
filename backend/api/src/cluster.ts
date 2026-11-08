// We don't need this for now as Railway scales up vCPU as a single core
// However if we where to migrate to a multi-core instance deployment, we need to run things this way as a cluster on the box
// Note that reflect-metadata and ./services/env need to be imported here
// https://elysiajs.com/patterns/deploy.html#cluster-mode
import cluster from 'node:cluster'
import os from 'node:os'
import process from 'node:process'
import "./services/env"

if (cluster.isPrimary) {
  const nodes = os.availableParallelism();
  console.log(`Starting cluster with ${nodes} threads`)
    for (let i = 0; i < nodes; i++) {
      cluster.fork()
    }
} else {
  await import('./server')
  console.log(`Worker ${process.pid} started`)
}