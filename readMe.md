# Usage

## 1. Download Amazon orders from Seller Central

## 2. Rename the file to **${fromDate}___${toDate}.txt**

## 3. Update the **fromDate** and **toDate** under scripts/index.ts to match the values in step 2.

## 4. Run the script

```bash
ts-node scripts/index.ts
```

## 5. Three files will be generated:

### 5.1. HST file ----> HST total for the range (No need to upload to Quickbooks, only for CRA filing purpose)

### 5.2. Orders report ----> Order sales to import to Quickbooks

### 5.3 Stock consumed report ----> Stock consumption to import to Quickbooks
