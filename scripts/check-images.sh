#!/bin/bash
docker images | grep devpulse
echo "-------------------------------------------"
echo "Target: each image should be under 200MB"
