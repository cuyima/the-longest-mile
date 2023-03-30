
pipeline {
    agent any
    environment {
        MODULE_NAME = ''
        PWSH = '/opt/powershell/pwsh'
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
                sh "$PWSH ./pack-compendium.ps1"
            }
        }

        stage('Prepare Deploy') {
            steps{
                sh "$PWSH ./prepare-deploy.ps1"
            }
        }

        stage('Deploy') {
            when {
                expression {
                    params.Deploy == true
                }
            }
            steps {
                sh "mkdir -p ${env.DESTINATION_FOLDER}/${env.MODULE_NAME}"
                sh "rm -rf ${env.DESTINATION_FOLDER}/${env.MODULE_NAME}/*"
                sh "cp -r ${env.WORKSPACE}/* ${env.DESTINATION_FOLDER}/${env.MODULE_NAME}/"
            }
        }
    }
}
