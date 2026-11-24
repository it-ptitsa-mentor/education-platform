"""Image mapping and import preservation across the filesystem boundary."""
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

class ImagesTest(unittest.TestCase):
    def load(self):
        with patch.dict(os.environ, {'BUILDIN_MCP_TOKEN': 'test'}):
            spec = importlib.util.spec_from_file_location('import_theory', Path(__file__).with_name('import-buildin-theory.py'))
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
        return mod

    def test_repository_registry_has_every_image(self):
        mod = self.load()
        registry = json.loads((mod.ROOT / 'content/theory-images.json').read_text())
        self.assertGreater(len(registry), 0)
        for block_id in registry:
            with self.subTest(block_id=block_id):
                if registry[block_id].get('skip'):
                    self.assertEqual(mod.registered_image(block_id, ''), '')
                else:
                    self.assertIn('](course/theory/assets/', mod.registered_image(block_id, ''))

    def test_reimport_keeps_assets_and_emits_registered_image(self):
        mod = self.load()
        with tempfile.TemporaryDirectory() as temp:
            mod.ROOT = Path(temp)
            mod.OUT = mod.ROOT / 'content/theory'
            asset = mod.OUT / 'assets/lesson/tags.png'
            asset.parent.mkdir(parents=True)
            asset.write_bytes(b'original PNG bytes')
            registry = {'block-1': {'path': 'assets/lesson/tags.png', 'alt': 'Теги HTML'}, 'tracker': {'skip': True}}
            (mod.ROOT / 'content/theory-images.json').write_text(json.dumps(registry))
            mod.MODULES = []
            mod.FROZEN_MODULES = set()
            mod.main()
            self.assertEqual(asset.read_bytes(), b'original PNG bytes')
            with patch.object(mod, 'children', return_value=[{'id': 'block-1', 'type': 'image', 'data': {}}]):
                result = '\n'.join(mod.blocks_to_md('lesson'))
            self.assertIn('![Теги HTML](course/theory/assets/lesson/tags.png)', result)
            with patch.object(mod, 'children', return_value=[{'id': 'tracker', 'type': 'image', 'data': {}}]):
                self.assertEqual(''.join(mod.blocks_to_md('lesson')), '')
            asset.unlink()
            with patch.object(mod, 'children', return_value=[{'id': 'block-1', 'type': 'image', 'data': {}}]):
                with self.assertRaises(FileNotFoundError):
                    mod.blocks_to_md('lesson')

if __name__ == '__main__':
    unittest.main()
