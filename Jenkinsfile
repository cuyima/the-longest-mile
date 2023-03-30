
pipeline {
    agent any
    environment {
        MODULE_NAME = "the-longest-mile"
    }
    parameters {
        booleanParam(name: 'Deploy', defaultValue: false, description: 'Deploy to Foundry')
    }
    stages {
        stage('Pack Compendiums') {
            sh "./pack-compendium.ps1"
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
