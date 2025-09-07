---
name: summarize
description: Generate comprehensive work session summary for context transfer
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git diff:*), Bash(find:*), Bash(grep:*), Bash(cat:*), Edit
---

# Comprehensive Work Session Analysis & Context Transfer Document

You must now ultrathink to perform an exhaustive analysis of our work session and generate a detailed summary that will enable a fresh Claude Code instance to continue our work seamlessly.

## Current Repository State
- Git status: !`git status --porcelain`
- Recent commits: !`git log --oneline -20`
- Current branch: !`git branch --show-current`
- Uncommitted changes: !`git diff --stat`
- Staged changes: !`git diff --cached --stat`

## Your Task: Deep Analysis and Documentation

Ultrathink through the following analysis, examining every file we've worked with and every conversation we've had. Generate a comprehensive report covering:

### 1. PROJECT OVERVIEW & OBJECTIVES
**Primary Mission:**
- What is the core application/system we're building or modifying?
- What specific features or capabilities were we trying to implement?
- What are the success criteria for our current work?
- What is the business/technical value of what we're implementing?

**Architecture & Design Decisions:**
- Key architectural patterns being used
- Technology stack and framework choices
- Design decisions made during our session and their rationale
- Trade-offs we've accepted and why

### 2. IMPLEMENTATION DEEP DIVE
**Core Implementation Details:**
- Detailed breakdown of the main logic/algorithms implemented
- Data structures and their purposes
- State management approach
- API contracts and interfaces defined
- Database schema changes (if any)
- Configuration changes made

**Integration Points:**
- External services/APIs being integrated
- Authentication/authorization implementation
- Message queues, webhooks, or event systems
- Third-party libraries added and their purposes

### 3. COMPREHENSIVE FILE ANALYSIS
For EVERY file we've created, modified, or discussed, provide: