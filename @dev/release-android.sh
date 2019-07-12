#! /usr/bin/env bash

DEV_FOLDER="./@dev"
RELEASE_FOLDER="./platforms/android/app/build/outputs/apk/release"
ZIPALIGN=$(grep -rl zipalign $ANDROID_HOME/build-tools/28.0.3) # provide zip align path here

{ # try

    echo '============'
    echo 'Removing previous release'
    echo '============'
    rm ${RELEASE_FOLDER}/meeting-point-signed.apk

    echo '============'
    echo 'Creating new release'
    echo '============'
    cordova build android --release

    echo '============'
    echo 'Singing JAR'
    echo '============'
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "${DEV_FOLDER}/meeting-point-keystore.jks" "${RELEASE_FOLDER}/app-release-unsigned.apk" meeting-point
    echo '============'
    echo 'Running zipAlign'
    echo '============'
    ${ZIPALIGN} -v 4 "${RELEASE_FOLDER}/app-release-unsigned.apk" "${RELEASE_FOLDER}/meeting-point-signed.apk"

    echo '============'
    echo 'Done'
    echo '============'
} || { # catch
    echo 'Something went wrong'
}
