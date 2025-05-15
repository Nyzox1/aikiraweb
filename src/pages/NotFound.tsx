import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8 dark:bg-gray-900">
      <div className="mx-auto max-w-max">
        <motion.div
          className="sm:flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p 
            className="text-4xl font-bold tracking-tight text-primary-600 sm:text-5xl"
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            404
          </motion.p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6 dark:sm:border-gray-700">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                Page not found
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                We couldn't find the page you're looking for.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/"
                className="btn-primary"
              >
                Go back home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}