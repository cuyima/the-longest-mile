
pipeline {
    agent any
    environment {
        DESTINATION_FOLDER = "/path/to/foundry"
        MODULE_NAME = "the-longest-mile"
    }
    parameters {
        booleanParam(name: 'deploy', defaultValue: false, description: 'Deploy to foundry')
        string(name: 'moduleName', defaultValue: 'the-longest-mile', description: 'The name of the module')
    }
    stages {
        stage('MyStage') {
            when {
                expression {
                    params.deploy == true
                }
            }
            steps {
              sh "mkdir -p ${env.DESTINATION_FOLDER}/${MODULE_NAME}"
              sh "rm -rf ${env.DESTINATION_FOLDER}/${MODULE_NAME}/*"
              sh "cp -r ${env.WORKSPACE}/* ${env.DESTINATION_FOLDER}/${MODULE_NAME}"
            }
        }
    }
}
