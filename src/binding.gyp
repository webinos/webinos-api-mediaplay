{
	'conditions': [
	        [ 'OS=="win"',
				{
					'variables': {
						'WinDDK_root': 'C:/WinDDK/7600.16385.1',
					},
				   'targets': [
                    {
						'target_name': 'mediaWMplayerControls',
						'sources': [ 'wmplayer.cc' ],
						'include_dirs': ['<(WinDDK_root)/inc/atl71'],
						'libraries': ['-l<(WinDDK_root)/lib/ATL/i386/atls.lib', '-l<(WinDDK_root)/lib/ATL/i386/atlsd.lib'],
					},
                    {
                        'target_name': 'webinos_wrt',
                        'type': 'none',
                        'toolsets': ['host'],
                        'copies': [{
                            'files': [
                            '<(PRODUCT_DIR)/mediaWMplayerControls.node',
                            ],
                            'destination': '../node_modules/',
                        }],
                    }],
				},
                {"targets": [{"target_name": "mediaWMplayerControls",}]},
			],
	],
}

