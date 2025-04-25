# Mermaid AWS Icons

A collection of AWS icons for use with Mermaid.js diagrams.

## Installation

```bash
npm install @codiva/aws-icons
```

## Usage

```javascript
import mermaid from 'mermaid';
import { icons } from '@codiva/aws-icons';

// Register the AWS icon pack
mermaid.registerIconPacks([
  {
    name: 'codiva-aws',
    icons,
  },
]);
```

Then in your Mermaid diagrams:

```mermaid
graph TD
    A[aws:lambda Lambda Function]
    B[aws:s3 S3 Bucket]
    A --> B
```

## Available Icons

All AWS service icons are available with the prefix `codiva-aws:`. For example:
- codiva-aws:lambda
- codiva-aws:s3
- codiva-aws:ec2
- codiva-aws:dynamodb

## License

This project is licensed under the MIT License. AWS icons are trademarks of Amazon Web Services, Inc.
