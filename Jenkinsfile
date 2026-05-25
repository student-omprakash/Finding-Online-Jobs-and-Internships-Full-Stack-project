pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        CI = 'true'
    }

    options {
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    stages {
        stage('🧹 Workspace Clean') {
            steps {
                echo 'Cleaning workspace from previous runs...'
                cleanWs()
            }
        }

        stage('📥 Checkout Code') {
            steps {
                echo 'Fetching latest codebase from GitHub...'
                checkout scm
            }
        }

        stage('📦 Install Dependencies') {
            steps {
                echo 'Installing workspace npm packages...'
                sh 'npm run install:all'
            }
        }

        stage('🔍 Frontend Quality Lint') {
            steps {
                echo 'Running ESLint validation on the frontend...'
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('✅ Backend Syntax Check') {
            steps {
                echo 'Verifying Node.js syntax and engine health...'
                dir('backend') {
                    sh 'node --check src/index.js'
                }
            }
        }

        stage('🏗️ Frontend Production Build') {
            steps {
                echo 'Compiling frontend client with Vite (production bundle)...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('🐳 Docker Environment Validation') {
            steps {
                echo 'Verifying docker-compose configurations...'
                sh 'docker-compose config'
            }
        }
    }

    post {
        always {
            echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
            echo '   Jenkins CI/CD Execution Summary Complete!'
            echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        }
        success {
            echo '🎉 SUCCESS: Pipeline completed without error.'
            echo '💻 Deployable build ready for Staging / Production!'
        }
        failure {
            echo '❌ FAILURE: One or more stages failed validation.'
            echo '🚨 Check build logs to address compilation or lint issues!'
        }
    }
}
