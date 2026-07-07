import re

with open('src/components/Resume.tsx', 'r') as f:
    content = f.read()

# Precise class replacements
replacements = {
    'bg-white text-[#1f2937] shadow-2xl': 'bg-white dark:bg-black text-[#1f2937] dark:text-gray-100 shadow-2xl dark:shadow-gray-900/50',
    'border-gray-200': 'border-gray-200 dark:border-gray-800',
    'border-gray-100': 'border-gray-100 dark:border-gray-800',
    'text-gray-900': 'text-gray-900 dark:text-white',
    'text-gray-700': 'text-gray-700 dark:text-gray-300',
    'text-gray-600': 'text-gray-600 dark:text-gray-400',
    'text-gray-500': 'text-gray-500 dark:text-gray-400',
    'bg-gray-100': 'bg-gray-100 dark:bg-gray-900',
    'bg-gray-50': 'bg-gray-50 dark:bg-gray-900',
    'border-black': 'border-black dark:border-white',
    'bg-black': 'bg-black dark:bg-white',
    # Adjust buttons
    'text-white bg-gray-900': 'text-white dark:text-black bg-gray-900 dark:bg-white',
    'hover:bg-gray-700': 'hover:bg-gray-700 dark:hover:bg-gray-200'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Ensure QR code wrappers stay purely white by reversing the dark:bg-black if it was applied there
content = content.replace('p-1 bg-white dark:bg-black border-gray-200 dark:border-gray-800 rounded-sm shadow-sm', 'p-1 bg-white border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm')

with open('src/components/Resume.tsx', 'w') as f:
    f.write(content)

with open('src/main.tsx', 'r') as f:
    main_content = f.read()

main_content = main_content.replace('bg-gray-100 flex justify-center', 'bg-gray-100 dark:bg-gray-950 flex justify-center')
main_content = main_content.replace('className="bg-white/60 backdrop-blur-md', 'className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md')

# Add dark mode toggle button
dark_btn = """
        <button 
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-xs font-bold py-1.5 px-3 rounded-md shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
        >
          <span>DARK</span>
        </button>
"""
main_content = main_content.replace('<span>PNG</span>\n        </button>', '<span>PNG</span>\n        </button>' + dark_btn)

with open('src/main.tsx', 'w') as f:
    f.write(main_content)

