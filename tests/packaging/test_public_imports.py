import subprocess
import sys


def test_core_boundaries_do_not_load_fastapi() -> None:
    code = """
import cpmoakb
import cpmoakb.application
import cpmoakb.cli
import cpmoakb.composition
import cpmoakb.http_api
import cpmoakb.runtime_api
import cpmoakb.serialization
import sys
assert cpmoakb.__version__ == '0.1.0'
assert 'fastapi' not in sys.modules
"""
    subprocess.run([sys.executable, "-c", code], check=True)
