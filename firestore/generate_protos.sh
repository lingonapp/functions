# Setup
#
# Install protoc:
# https://github.com/protocolbuffers/protobuf/releases
#
# Install firebase rules plugin
# https://github.com/FirebaseExtended/protobuf-rules-gen/releases
#
# Install ts plugin
# npm install -g ts-protoc-gen
#
# Install dart gen plugin
# https://github.com/dart-lang/protobuf/tree/master/protoc_plugin
#

PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"


PROTOS_DIR="./protos"
TS_OUT_DIR="./__generated_ts_rules__"
FIREBASE_OUT_DIR="./__generated_firebase_rules__"
DART_OUT_DIR="./__generated_dart_rules__"

protoc \
   --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
  --proto_path="${PROTOS_DIR}" \
  --ts_out="${TS_OUT_DIR}" \
  --firebase_rules_out="${FIREBASE_OUT_DIR}" \
  --dart_out="${DART_OUT_DIR}" "${PROTOS_DIR}/all.proto"
