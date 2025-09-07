# Zen-Gemini Deep Analysis

**Command:** `/zen-analyze`

## Description
Initiates a comprehensive analysis session with Gemini-2.5-pro via the zen MCP server to identify root causes of issues or evaluate implementation quality. This command focuses on systematic analysis rather than quick fixes.

## Usage
```bash
/zen-analyze [component-path] [--issue "description"] [--mode analysis|debug]
```

## Parameters
- `component-path`: Path to the specific component/module being analyzed
- `--issue`: (Optional) Description of the current issue or concern
- `--mode`: Analysis mode - either `analysis` for general evaluation or `debug` for issue investigation

## Implementation

### Phase 1: Context Preparation & Ultra-Thinking

First, I'll engage in comprehensive context gathering and ultra-thinking to prepare for the Gemini consultation:

**Context Collection:**
1. **Project Structure Analysis**
   - Map the entire project architecture
   - Identify dependencies and relationships
   - Document the technology stack and versions
   - Collect package.json/requirements.txt/build files

2. **Component Deep-Dive**
   - Analyze the target component and all related files
   - Trace data flow and state management
   - Document API integrations and external dependencies
   - Identify design patterns and architectural decisions

3. **Issue Contextualization** (if applicable)
   - Reproduce the issue systematically
   - Collect error logs, stack traces, and debugging output
   - Document expected vs actual behavior
   - Identify when the issue first appeared (git history analysis)

4. **API Documentation Gathering**
   - Fetch latest documentation for all APIs in use
   - Compare current implementation against best practices
   - Identify version mismatches or deprecated usage
   - Document rate limits, authentication, and error handling patterns

### Phase 2: Zen MCP Initialization

**Establish Gemini Connection:**
```javascript
// Initialize zen MCP server connection
const zenConnection = await mcp.connect('zen');
const geminiSession = await zenConnection.startSession({
  model: 'gemini-2.5-pro',
  temperature: 0.1, // Lower for more focused analysis
  systemPrompt: `You are an expert software architect and debugging specialist. 
                  Your role is to identify root causes, not surface-level fixes. 
                  Focus on architectural patterns, design decisions, and systematic issues.`
});
```

### Phase 3: Structured Analysis Prompt

**Primary Analysis Request:**
```markdown
## Deep Analysis Request

### Project Context
- **Technology Stack:** [Auto-populated from project analysis]
- **Architecture Pattern:** [Identified pattern - MVC, microservices, etc.]
- **Primary Dependencies:** [Key libraries and frameworks]
- **Component Role:** [Function within larger system]

### Code Context
[Attach all relevant files with clear annotations]

### Issue Details (if applicable)
- **Symptoms:** [Observable problems]
- **Impact:** [User/system effects]
- **Frequency:** [When it occurs]
- **Environment:** [Where it happens]

### Analysis Focus Areas
1. **Root Cause Investigation:** Look beyond symptoms to identify architectural or design issues
2. **Code Quality Assessment:** Evaluate maintainability, scalability, and robustness
3. **Performance Analysis:** Identify bottlenecks and optimization opportunities
4. **Security Review:** Check for vulnerabilities and best practices
5. **Future-Proofing:** Assess adaptability and technical debt

### Specific Questions
- What underlying design decisions led to this issue?
- Are there systemic patterns that could cause similar issues?
- How does this component's architecture align with best practices?
- What would a more robust implementation look like?
```

### Phase 4: Deep Thinking Invocation

**Activate Gemini's Deep Thinking:**
```javascript
// Use zen MCP's thinkdeep function for systematic analysis
await zenConnection.invoke('thinkdeep', {
  prompt: analysisRequest,
  depth: 'maximum',
  focus: ['root-cause-analysis', 'architectural-review', 'systematic-thinking'],
  constraints: [
    'Avoid surface-level fixes',
    'Focus on underlying causes',
    'Consider long-term implications',
    'Evaluate architectural fitness'
  ]
});

// Follow up with thinkdeeper for additional perspectives
await zenConnection.invoke('thinkdeeper', {
  previousAnalysis: true,
  additionalPerspectives: [
    'security-expert',
    'performance-specialist', 
    'maintainability-focused',
    'scalability-architect'
  ]
});
```

### Phase 5: Collaborative Deep Dive

**Iterative Analysis Process:**
1. **Initial Assessment:** Gemini provides comprehensive analysis
2. **Clarification Round:** Ask follow-up questions on unclear points
3. **Alternative Approaches:** Explore different implementation strategies
4. **Trade-off Analysis:** Evaluate pros/cons of different solutions
5. **Implementation Roadmap:** Develop step-by-step improvement plan

**Sample Follow-up Prompts:**
```markdown
## Follow-up Analysis Points

### Architectural Deep Dive
- "Given your analysis, how would you redesign this component from scratch?"
- "What patterns from other domains could solve this more elegantly?"
- "How does this implementation compare to industry standards?"

### Root Cause Validation
- "Walk through the causal chain that leads to this issue"
- "What would need to change in the codebase to prevent this class of problems?"
- "Are there similar issues lurking elsewhere in the codebase?"

### Future-Proofing Assessment
- "How will this component handle 10x scale?"
- "What happens when [specific dependency] changes?"
- "How maintainable is this approach for a growing team?"
```

### Phase 6: Synthesis and Action Planning

**Output Structure:**
```markdown
# Zen-Gemini Analysis Report

## Executive Summary
[High-level findings and recommendations]

## Root Cause Analysis
### Primary Cause
[The fundamental issue identified]

### Contributing Factors
[Secondary issues that compound the problem]

### Systemic Patterns
[Broader codebase patterns that need attention]

## Architectural Assessment
### Current Implementation Strengths
[What's working well]

### Architectural Gaps
[Missing patterns or poor design choices]

### Technical Debt Assessment
[Accumulated issues and their impact]

## Recommendations

### Immediate Actions (0-2 weeks)
[Critical fixes that address root causes]

### Short-term Improvements (1-2 months)
[Structural improvements and optimizations]

### Long-term Strategy (3-6 months)
[Architectural evolution and major refactoring]

## Implementation Guidance
### Code Examples
[Specific implementation suggestions]

### Testing Strategy
[How to validate improvements]

### Monitoring & Prevention
[How to prevent regression]

## Additional Considerations
### Performance Impact
### Security Implications
### Team Knowledge Transfer Needs
```

## Advanced Options

### Multi-Perspective Analysis
```bash
/zen-analyze --perspectives security,performance,maintainability
```

### Comparative Implementation Review
```bash
/zen-analyze --compare-with [reference-implementation-path]
```

### Technical Debt Assessment
```bash
/zen-analyze --debt-assessment --prioritize-by impact
```

### Architecture Evolution Planning
```bash
/zen-analyze --evolution-plan --timeline 6months
```

## Best Practices for Usage

1. **Prepare Clean Context:** Ensure code is well-commented and recent
2. **Be Specific:** Provide clear problem statements or analysis goals
3. **Include Edge Cases:** Mention unusual scenarios or edge conditions
4. **Document Assumptions:** Share any architectural assumptions or constraints
5. **Follow Up:** Use the analysis for actual implementation improvements

## Integration Points

- **Git Integration:** Automatically create improvement branches
- **Issue Tracking:** Generate tickets for identified improvements
- **Documentation:** Update architectural documentation with findings
- **Monitoring:** Set up alerts for identified risk areas

---