# Running Squabdox on CPU-Only Systems

This guide explains how to run Squabdox on systems without GPU acceleration.

## CPU-Optimized Setup

For systems without NVIDIA GPUs, we've provided a CPU-optimized script that uses a smaller language model:

```bash
./run-cpu.sh
```

This script:
1. Uses the TinyLlama model instead of the larger OpenAI OSS model
2. Configures the containers for CPU-only operation
3. Starts all services with appropriate settings

## Model Comparison

| Model | Size | Performance | Good for |
|-------|------|-------------|----------|
| OpenAI OSS | ~7GB | Best quality | Systems with GPU |
| TinyLlama | ~1.1GB | Good quality | CPU-only systems |

## Customizing the Model

You can use a different model by setting the LLM_MODEL environment variable:

```bash
export LLM_MODEL="llama2:7b"
./run-docker.sh
```

Available models optimized for CPU:
- tinyllama
- mistral:7b-instruct-v0.2-q4_0
- llama2:7b-chat-q4_0

## Performance Tips

When running on CPU:

1. **Reduce requirements complexity**: Simpler requirements will generate faster
2. **Be patient**: Generation will be much slower than with GPU acceleration
3. **Limit concurrent usage**: CPU resources are shared among all containers
4. **Allocate sufficient memory**: At least 8GB RAM is recommended

## Monitoring Resource Usage

To check resource usage:

```bash
docker stats
```

If you see memory issues, you can increase Docker's memory allocation in Docker Desktop settings.