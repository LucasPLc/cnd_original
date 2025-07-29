
C:\Users\Lukin\Desktop\projeto-cnd\cnd_original>docker-compose up --build
time="2025-07-29T09:16:43-03:00" level=warning msg="C:\\Users\\Lukin\\Desktop\\projeto-cnd\\cnd_original\\docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
[+] Running 19/19
 ✔ watchtower Pulled                                                                                               7.2s
   ✔ 1f05004da6d7 Download complete                                                                                0.9s
   ✔ 57241801ebfd Download complete                                                                                0.4s
   ✔ 3d4f475b92a2 Download complete                                                                                0.9s
 ✔ bd-cnd Pulled                                                                                                  10.2s
   ✔ 59e22667830b Download complete                                                                                3.2s
   ✔ 6b3b5f65e3cd Download complete                                                                                0.5s
   ✔ 75d30a5de1fb Download complete                                                                                4.2s
   ✔ 19a781737ad0 Download complete                                                                                0.6s
   ✔ c98010e7bb9b Download complete                                                                                1.1s
   ✔ 9204b4e7631a Download complete                                                                                1.5s
   ✔ e1ee0353aab9 Download complete                                                                                0.9s
   ✔ 3dc5e0f3117f Download complete                                                                                0.9s
   ✔ 1d577202ffc0 Download complete                                                                                0.9s
   ✔ ff24f36f9605 Download complete                                                                                1.8s
   ✔ d7f875e2b62b Download complete                                                                                0.9s
   ✔ b8860d4eda7a Download complete                                                                                1.1s
   ✔ b08c5deb8c35 Download complete                                                                                1.2s
   ✔ 97afbbdefb7d Download complete                                                                                1.1s
[+] Building 65.9s (26/28)                                                                         docker:desktop-linux
 => [cnd internal] load build definition from Dockerfile                                                           0.0s
 => => transferring dockerfile: 325B                                                                               0.0s
 => [cnd internal] load metadata for docker.io/library/eclipse-temurin:21-jre-alpine                               1.1s
 => [cnd internal] load metadata for docker.io/library/maven:3.9.6-eclipse-temurin-21                              1.0s
 => [cnd internal] load .dockerignore                                                                              0.0s
 => => transferring context: 2B                                                                                    0.0s
 => [cnd builder 1/4] FROM docker.io/library/maven:3.9.6-eclipse-temurin-21@sha256:8d63d4c1902cb12d9e79a70671b18e  0.0s
 => => resolve docker.io/library/maven:3.9.6-eclipse-temurin-21@sha256:8d63d4c1902cb12d9e79a70671b18ebe26358cb592  0.0s
 => [cnd internal] load build context                                                                              2.1s
 => => transferring context: 4.47MB                                                                                2.1s
 => [cnd stage-1 1/3] FROM docker.io/library/eclipse-temurin:21-jre-alpine@sha256:7b5c88eb4182a92aab3a4b10550061a  0.0s
 => => resolve docker.io/library/eclipse-temurin:21-jre-alpine@sha256:7b5c88eb4182a92aab3a4b10550061a6e18639bf176  0.0s
 => CACHED [cnd builder 2/4] WORKDIR /app                                                                          0.0s
 => [cnd builder 3/4] COPY . .                                                                                    12.6s
 => [cnd builder 4/4] RUN mvn clean package -DskipTests                                                           20.1s
 => CACHED [cnd stage-1 2/3] WORKDIR /app                                                                          0.0s
 => [cnd stage-1 3/3] COPY --from=builder /app/target/saam-cnd.jar app.jar                                         0.8s
 => [cnd] exporting to image                                                                                       3.3s
 => => exporting layers                                                                                            2.8s
 => => exporting manifest sha256:56178cb9c674a73a2bb61a982b756edcfad45f54328b22c53de5c55334930360                  0.0s
 => => exporting config sha256:acaabe60849af9fb5fceee1bff3977759308b4c5ea3c9513daac51c0304cd1ca                    0.0s
 => => exporting attestation manifest sha256:aa5f7dadb37761f2832cafcf9f8eda4ce93b1c94c58f8f404db4fb5f6173d743      0.0s
 => => exporting manifest list sha256:ab5cb129bd086e08bc4db3ca85a5718d061e91b70e3cacee8726efdf1d603bb8             0.0s
 => => naming to docker.io/library/cnd_original-cnd:latest                                                         0.0s
 => => unpacking to docker.io/library/cnd_original-cnd:latest                                                      0.3s
 => [cnd] resolving provenance for metadata file                                                                   0.0s
 => [frontend internal] load build definition from Dockerfile                                                      0.0s
 => => transferring dockerfile: 432B                                                                               0.0s
 => WARN: FromAsCasing: 'as' and 'FROM' keywords' casing do not match (line 2)                                     0.0s
 => [frontend internal] load metadata for docker.io/library/nginx:stable-alpine                                    0.9s
 => [frontend internal] load metadata for docker.io/library/node:18-alpine                                         0.6s
 => [frontend internal] load .dockerignore                                                                         0.0s
 => => transferring context: 146B                                                                                  0.0s
 => [frontend internal] load build context                                                                         0.0s
 => => transferring context: 8.90kB                                                                                0.0s
 => [frontend build 1/6] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d11894558  0.1s
 => => resolve docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8c  0.0s
 => [frontend stage-1 1/3] FROM docker.io/library/nginx:stable-alpine@sha256:d83c0138ea82c9f05c4378a5001e0c71256b  0.1s
 => => resolve docker.io/library/nginx:stable-alpine@sha256:d83c0138ea82c9f05c4378a5001e0c71256b647603c10c186bd76  0.0s
 => CACHED [frontend build 2/6] WORKDIR /app                                                                       0.0s
 => CACHED [frontend build 3/6] COPY package*.json ./                                                              0.0s
 => CACHED [frontend build 4/6] RUN npm install                                                                    0.0s
 => [frontend build 5/6] COPY . .                                                                                  0.9s
 => ERROR [frontend build 6/6] RUN npm run build                                                                  23.4s
------
 > [frontend build 6/6] RUN npm run build:
0.351
0.351 > frontend@0.1.0 build
0.351 > react-scripts build
0.351
1.443 Creating an optimized production build...
23.12 Failed to compile.
23.12
23.12 Attempted import error: '../components/ImportSaamModal' does not contain a default export (imported as 'ImportSaamModal').
23.12
23.12
------
failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1

C:\Users\Lukin\Desktop\projeto-cnd\cnd_original>