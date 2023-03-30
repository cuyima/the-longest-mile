
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
            steps {
                script {
                    def outputFolder = './release'
                    env.MODULE_NAME = readJSON(file: 'module.json').name
                    sh "mkdir -p $outputFolder"
                    sh "rm -rf $outputFolder/*"

                    sh """
                        for F in ./*; do
                            if [ "\$(basename \$F)" != "release" ] && \
                            [ "\$(basename \$F)"  != "input-items" ] && \
                            [ "\$(basename \$F)" != "output-items" ]; then
                                cp -r \$F $outputFolder
                            fi
                        done
                      """

                    /*sh """
                        for F in ${outputFolder}/packs/*; do
                            rm -rf \$F
                        done
                       """*/

                    sh "cp ./module.json $outputFolder"

                }
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
