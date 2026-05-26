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
    }

    stages {
        stage('🧹 Workspace Clean') {
            steps {
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '   STAGE: Cleaning Workspace'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo 'Cleaning workspace from previous runs...'
                cleanWs()
            }
        }

        stage('📥 Checkout Code') {
            steps {
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '   STAGE: Fetching Codebase'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo 'Fetching latest codebase from Git repository...'
                checkout scm
            }
        }

        stage('📦 Install Dependencies') {
            steps {
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '   STAGE: Installing Dependencies'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo 'Installing workspace npm packages for all modules...'
                sh 'npm run install:all'
            }
        }

        stage('🔍 Frontend Quality Lint') {
            steps {
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '   STAGE: Frontend Quality Lint'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo 'Running ESLint validation on the frontend client...'
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('✅ Backend Syntax Check') {
            steps {
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '   STAGE: Backend Syntax Check'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo 'Verifying Node.js syntax and engine health...'
                dir('backend') {
                    sh 'node --check src/index.js'
                }
            }
        }

        stage('🏗️ Frontend Production Build') {
            steps {
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '   STAGE: Frontend Production Build'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo 'Compiling frontend client with Vite (production bundle)...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('🐳 Docker Environment Validation') {
            steps {
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo '   STAGE: Docker Compose Validation'
                echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
                echo 'Verifying docker-compose configurations...'
                sh 'docker compose config'
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
