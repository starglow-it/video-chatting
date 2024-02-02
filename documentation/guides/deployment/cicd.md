# CI/CD
## Set up Github Self-hosted runners
#### 1. Go to the repository’s settings. In there, select runners under Actions and click on new self-hosted runner.

[Illustration-1](../../assets/images/self-hosted-1.png)

#### 2. This will lead you to the set up page. You’ll be able to download the runner script for the OS and hardware you need with clear to follow instructions.

[Illustration-2](../../assets/images/self-hosted-2.png)


#### 3. Configuration:
- Add the label for each runner:
    - Production runner: `liveofficeProd`
    - Staging runner: `liveofficeStaging-aws`

[Illustration-3](../../assets/images/self-hosted-3.png)

## Create branches to apply runners
- Production env: `production`
- Staging env: `staging`
