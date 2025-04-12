import type { LintResult, LintRule, RuleConfig, RuleLevel } from './types'
import { config } from './config'
import { rules } from './rules'

/**
 * Parse and normalize rule levels
 */
function normalizeRuleLevel(level: RuleLevel): 0 | 1 | 2 {
  if (level === 'off')
    return 0
  if (level === 'warning')
    return 1
  if (level === 'error')
    return 2
  return level
}

/**
 * Lint a commit message against configured rules
 */
export function lintCommitMessage(message: string, verbose = config.verbose): LintResult {
  const result: LintResult = {
    valid: true,
    errors: [],
    warnings: [],
  }

  // Skip linting if message matches ignores
  if (config.ignores?.some((pattern: string) => new RegExp(pattern).test(message))) {
    if (verbose) {
      console.error('Commit message matched ignore pattern, skipping validation')
    }
    return result
  }

  // Apply all configured rules
  Object.entries(config.rules || {}).forEach(([ruleName, ruleConfig]) => {
    const rule = rules.find((r: LintRule) => r.name === ruleName)
    if (!rule) {
      if (verbose) {
        console.warn(`Rule "${ruleName}" not found, skipping`)
      }
      return
    }

    let level: RuleLevel = 0
    let ruleOptions: RuleConfig | undefined

    // Handle different rule configuration formats
    if (Array.isArray(ruleConfig)) {
      [level, ruleOptions] = ruleConfig
    }
    else {
      level = ruleConfig
    }

    const normalizedLevel = normalizeRuleLevel(level)

    // Skip disabled rules
    if (normalizedLevel === 0) {
      return
    }

    // Validate against rule
    const ruleResult = rule.validate(message, ruleOptions)

    if (!ruleResult.valid) {
      const errorMessage = ruleResult.message || `Rule "${ruleName}" failed validation`

      if (normalizedLevel === 2) {
        result.errors.push(errorMessage)
        result.valid = false
      }
      else if (normalizedLevel === 1) {
        result.warnings.push(errorMessage)
      }
    }
  })

  return result
}
