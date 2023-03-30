
pipeline {
    agent any
    environment {
        MODULE_NAME = ''
    }
    parameters {
        booleanParam(name: 'Deploy', defaultValue: false, description: 'Deploy to Foundry')
    }
    stages {
        stage('Pack Compendiums') {
            steps{
                script{
                    env.MODULE_NAME = readJSON(file: 'module.json').name
                }
                sh "${env.PWSH} ./pack-compendium.ps1"
            }
        }

        stage('Prepare Deploy') {
            steps{
                sh "${env.PWSH} ./prepare-deploy.ps1"
            }
        }

        stage('Deploy') {
            when {
                expression {
                    params.Deploy == true
                }
            }
            steps {
                sh "mkdir -p ${env.FOUNDRY_FOLDER}/${env.MODULE_NAME}"
                sh "rm -rf ${env.FOUNDRY_FOLDER}/${env.MODULE_NAME}/*"
                sh "cp -r ${env.WORKSPACE}/* ${env.FOUNDRY_FOLDER}/${env.MODULE_NAME}/"
            }
        }
    }
}
