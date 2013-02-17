INBLOOM_CONFIG = YAML.load(File.read(File.expand_path('../../inbloom.yml', __FILE__)))
INBLOOM_CONFIG.merge! INBLOOM_CONFIG.fetch(Rails.env, {})
INBLOOM_CONFIG.symbolize_keys!