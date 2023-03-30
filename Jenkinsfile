
pipeline {
    agent any
    environment {
        MODULE_NAME = "the-longest-mile"
    }
    parameters {
        booleanParam(name: 'deploy', defaultValue: false, description: 'Deploy to Foundry')
    }
    stages {
        stage('Deploy') {
            when {
                expression {
                    params.deploy == true
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
