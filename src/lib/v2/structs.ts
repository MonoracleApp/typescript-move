import chalk from 'chalk';

interface StructProperty {
  name: string;
  type: string;
}

interface StructInfo {
  name: string | undefined;
  properties: StructProperty[];
  abilities: string[];
}

/**
 * Maps TypeScript types to Move types
 */
function mapTypeScriptToMove(tsType: string): string {
  // Remove import() wrapper and extract the actual type
  const cleanType = tsType
    .replace(/import\([^)]+\)\./g, '')
    .trim();

  // Direct mappings
  const typeMap: Record<string, string> = {
    'String': 'String',
    'u64': 'u64',
    'u32': 'u32',
    'u8': 'u8',
    'u16': 'u16',
    'u128': 'u128',
    'u256': 'u256',
    'bool': 'bool',
    'address': 'address',
    'UID': 'sui::object::UID',
  };

  return typeMap[cleanType] || cleanType;
}

/**
 * Validates struct abilities and throws error if invalid combinations found
 */
export function validateStructAbilities(structs: StructInfo[]): void {
  if (!structs || structs.length === 0) {
    return;
  }

  const errors: string[] = [];

  structs.forEach(struct => {
    const hasCopyAbility = struct.abilities.includes('copy');
    const hasKeyAbility = struct.abilities.includes('key');

    if (hasCopyAbility && hasKeyAbility) {
      errors.push(`Struct "${struct.name}" has both "copy" and "key" abilities.`);
    }
  });

  if (errors.length > 0) {
    console.log('\n' + chalk.red('='.repeat(60)));
    console.log(chalk.red.bold('❌ Struct Validation Error:'));
    console.log(chalk.red('='.repeat(60)));
    errors.forEach(error => {
      console.log(chalk.red(`  • ${error}`));
    });
    console.log(chalk.red('\nMove does not allow a struct to have both "copy" and "key" abilities.'));
    console.log(chalk.red('Please remove one of these abilities from your struct definition.'));
    console.log(chalk.red('='.repeat(60)) + '\n');
    process.exit(1);
  }
}

/**
 * Generates Move struct definitions from interface information
 */
export function generateMoveStructs(structs: StructInfo[]): string {
  if (!structs || structs.length === 0) {
    return '';
  }

  const moveStructs = structs.map(struct => {
    if (!struct.name) return '';

    // Generate abilities string
    const abilitiesStr = struct.abilities.length > 0
      ? ` has ${struct.abilities.join(', ')}`
      : '';

    // Generate properties
    const properties = struct.properties
      .map(prop => `    ${prop.name}: ${mapTypeScriptToMove(prop.type)}`)
      .join(',\n');

    return `public struct ${struct.name}${abilitiesStr} {
${properties}
  }`;
  }).filter(s => s !== '');

  return moveStructs.length > 0
    ? moveStructs.join('\n\n') + '\n'
    : '';
}
