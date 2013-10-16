/*******************************************************************************
 *    Code contributed to the webinos project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2013 Istituto Superiore Mario Boella (ISMB)
 ******************************************************************************/

#define BUILDING_NODE_EXTENSION
#include "wmplayer.h"


Handle<Boolean> openMedia(const wchar_t* media){
	CComPtr<IWMPPlayer4> spPlayer;	
	Handle<Boolean> ret;
	HRESULT res;

	CoInitialize(NULL);
	res = CoCreateInstance( __uuidof(WindowsMediaPlayer), NULL, CLSCTX_ALL, __uuidof(IWMPPlayer4), (void**)&spPlayer);

	if(res!=S_OK)
		return v8::Boolean::New(false);			
	else
		std::cout<<"openMedia: "<<res<<std::endl;

	spPlayer->openPlayer(SysAllocString(media));

	return v8::Boolean::New(true);	
}

bool file_exists(const char *filename)
{
    if (FILE *file = fopen(filename, "r")){
        fclose(file);
        return true;
    }
    return false;
}

Handle<Boolean> setFullscreen(){	
	HWND player = NULL;
	LRESULT res;	

	player = FindWindow(NULL, "Windows Media Player");
	if(player != NULL){
		std::cout<<"FindWindow: OK"<<std::endl;

		INPUT input[4];
		memset(input, 0, sizeof(INPUT)*4);
		input[0].type = INPUT_KEYBOARD;
		input[0].ki.wVk = VK_LMENU;
		input[1].type = INPUT_KEYBOARD;
		input[1].ki.wVk = VK_RETURN;
		input[2].type = INPUT_KEYBOARD;
		input[2].ki.wVk = VK_RETURN;
		input[2].ki.dwFlags = KEYEVENTF_KEYUP;
		input[3].type = INPUT_KEYBOARD;
		input[3].ki.wVk = VK_LMENU;
		input[3].ki.dwFlags = KEYEVENTF_KEYUP;

		res = SendInput(4, input, sizeof(INPUT));
		
		std::cout<<"Post fullscreen command returns: "<<res<<std::endl;
		if(res != 0)
			return v8::Boolean::New(false);	
	}
	else{
		std::cout<<"FindWindow: ERROR"<<std::endl;
		return v8::Boolean::New(false);
	}

	return v8::Boolean::New(true);	
}



Handle<Boolean> sendMediaCommand(int pCommand){	
	HWND player = NULL;
	LRESULT res;	

	player = FindWindow(NULL, "Windows Media Player");
	if(player != NULL){
		std::cout<<"FindWindow: OK"<<std::endl;
		res = SendMessage(player, 0x0319, 0x00000000, pCommand << 16);
		std::cout<<"SendMessage "<<pCommand<< " returns: "<<res<<std::endl;
		if(res == 0)
			return v8::Boolean::New(false);	
	}
	else{
		std::cout<<"FindWindow: ERROR"<<std::endl;
		return v8::Boolean::New(false);	
	}

	return v8::Boolean::New(true);	
}


Handle<Boolean> sendMovieJump(std::string cmd){
    HWND player = NULL;
    LRESULT res = -1;

    player = FindWindow(NULL, "Windows Media Player");
    if(player != NULL){
        std::cout<<"FindWindow: OK"<<std::endl;


        if(cmd.compare("step-forward") == 0){
            INPUT input[2];
            memset(input, 0, sizeof(INPUT)*2);
            input[0].type = INPUT_KEYBOARD;
            input[0].ki.wVk = VK_RIGHT;
            input[1].type = INPUT_KEYBOARD;
            input[1].ki.wVk = VK_RIGHT;
            input[1].ki.dwFlags = KEYEVENTF_KEYUP;
            res = SendInput(4, input, sizeof(INPUT));
        }
        else if(cmd.compare("step-backward") == 0){
            INPUT input[2];
            memset(input, 0, sizeof(INPUT)*2);
            input[0].type = INPUT_KEYBOARD;
            input[0].ki.wVk = VK_LEFT;
            input[1].type = INPUT_KEYBOARD;
            input[1].ki.wVk = VK_LEFT;
            input[1].ki.dwFlags = KEYEVENTF_KEYUP;
            res = SendInput(4, input, sizeof(INPUT));
        }
        else if(cmd.compare("bigstep-forward") == 0){
            INPUT input[4];
            memset(input, 0, sizeof(INPUT)*4);
            input[0].type = INPUT_KEYBOARD;
            input[0].ki.wVk = VK_CONTROL;
            input[1].type = INPUT_KEYBOARD;
            input[1].ki.wVk = VK_RIGHT;
            input[2].type = INPUT_KEYBOARD;
            input[2].ki.wVk = VK_RIGHT;
            input[2].ki.dwFlags = KEYEVENTF_KEYUP;
            input[3].type = INPUT_KEYBOARD;
            input[3].ki.wVk = VK_CONTROL;
            input[3].ki.dwFlags = KEYEVENTF_KEYUP;
            res = SendInput(4, input, sizeof(INPUT));
        }
        else if(cmd.compare("bigstep-backward") == 0){
            INPUT input[4];
            memset(input, 0, sizeof(INPUT)*4);
            input[0].type = INPUT_KEYBOARD;
            input[0].ki.wVk = VK_CONTROL;
            input[1].type = INPUT_KEYBOARD;
            input[1].ki.wVk = VK_LEFT;
            input[2].type = INPUT_KEYBOARD;
            input[2].ki.wVk = VK_LEFT;
            input[2].ki.dwFlags = KEYEVENTF_KEYUP;
            input[3].type = INPUT_KEYBOARD;
            input[3].ki.wVk = VK_CONTROL;
            input[3].ki.dwFlags = KEYEVENTF_KEYUP;
            res = SendInput(4, input, sizeof(INPUT));
        }

        std::cout<<"Post "<<cmd<<" command returns: "<<res<<std::endl;
        if(res != 4)
            return v8::Boolean::New(false);
    }
    else{
        std::cout<<"FindWindow: ERROR"<<std::endl;
        return v8::Boolean::New(false);
    }

    return v8::Boolean::New(true);
}




Handle<Boolean> sendVolumeCommand(std::string cmd){	
	HWND player = NULL;
	LRESULT res = 0;	

	player = FindWindow(NULL, "Windows Media Player");
	if(player != NULL){
		std::cout<<"FindWindow: OK"<<std::endl;

        if(cmd.compare("down") == 0)
            res = PostMessage(player, WM_KEYDOWN, VK_F8, 0);
        else if(cmd.compare("up") == 0)
            res = PostMessage(player, WM_KEYDOWN, VK_F9, 0);

		std::cout<<"Post volume command "<<cmd<<" returns: "<<res<<std::endl;
		if(res != 1)
			return v8::Boolean::New(false);	
	}
	else{
		std::cout<<"FindWindow: ERROR"<<std::endl;
		return v8::Boolean::New(false);	
	}

	return v8::Boolean::New(true);	
}



Handle<Boolean> sendClose(){	
	HWND player = NULL;
	LRESULT res;	

	player = FindWindow(NULL, "Windows Media Player");
	if(player != NULL){
		std::cout<<"FindWindow: OK"<<std::endl;
		res = SendMessage(player, 0x0112, 0xF060, 0);
		std::cout<<"SendClose returns: "<<res<<std::endl;
		if(res != 0)
			return v8::Boolean::New(false);	
	}
	else{
		std::cout<<"FindWindow: ERROR"<<std::endl;
		return v8::Boolean::New(false);	
	}

	return v8::Boolean::New(true);	
}




Handle<Value> Controls(const Arguments& args) {
    HandleScope scope;
	Handle<Boolean> ret;

	//convert from v8::String to std::string
    v8::String::Utf8Value argUTF8_cmd(args[0]->ToString());
    std::string cmd = std::string(*argUTF8_cmd);
	v8::String::Utf8Value argUTF8_media(args[1]->ToString());
	std::string media = std::string(*argUTF8_media);

    if(args.Length() != 1 && cmd.compare("open") != 0) {
		ThrowException(Exception::TypeError(String::New("Wrong number of arguments for this command")));
		return v8::Boolean::New(false);
    }
	else if(args.Length() != 2 && cmd.compare("open") == 0) {
		ThrowException(Exception::TypeError(String::New("Wrong number of arguments for open command")));
		return v8::Boolean::New(false);
	}

	if (!args[0]->IsString()) {
        ThrowException(Exception::TypeError(String::New("Wrong arguments type")));
        return scope.Close(Undefined());
    }


    if(cmd.compare("open") == 0){
		std::cout<<cmd<<std::endl;		
		if(!file_exists(media.c_str())){
			std::cout<<"Error: cannot open media file '"<<media<<"'"<<std::endl;
			return v8::Boolean::New(false);
		}
		//wchar_t* file = L"C:\\Videos\\sintel-2048-surround.mp4";
		std::wstring file(media.begin(), media.end());
        ret = openMedia(file.c_str());
		Sleep(3000); //to be sure that windows in created
		setFullscreen();
		Sleep(1000);
		//set volume at 30%
		for(int i=0; i<10;i++) sendVolumeCommand("down");
		for(int i=0; i<3;i++) sendVolumeCommand("up");

    }
    else if(cmd.compare("play") == 0){
        ret = sendMediaCommand(APPCOMMAND_MEDIA_PLAY);
    }
    else if(cmd.compare("pause") == 0){
        ret = sendMediaCommand(APPCOMMAND_MEDIA_PAUSE);
    }
	else if(cmd.compare("stop") == 0){
        ret = sendMediaCommand(APPCOMMAND_MEDIA_STOP);
    }
	else if(cmd.compare("fast-forward") == 0){
        ret = sendMediaCommand(APPCOMMAND_MEDIA_FAST_FORWARD);
    }
	else if(cmd.compare("media-rewind") == 0){
        ret = sendMediaCommand(APPCOMMAND_MEDIA_REWIND);
    }
    else if(cmd.compare("step-forward") == 0){
        ret = sendMovieJump("step-forward");
    }
    else if(cmd.compare("step-backward") == 0){
        ret = sendMovieJump("step-backward");
    }
    else if(cmd.compare("bigStep-forward") == 0){
        ret = sendMovieJump("bigstep-forward");
    }
    else if(cmd.compare("bigStep-backward") == 0){
        ret = sendMovieJump("bigstep-backward");
    }
	else if(cmd.compare("volumeUP") == 0){
        ret = sendVolumeCommand("up");	
    }
	else if(cmd.compare("volumeDOWN") == 0){
        ret = sendVolumeCommand("down");	
    }
	else if(cmd.compare("volumeMUTE") == 0){
        ret = sendVolumeCommand("mute");	
    }
	else if(cmd.compare("close") == 0){
        ret = sendClose();
    }
    else
        return v8::Boolean::New(false);

    return scope.Close(ret);
}


void Init(Handle<Object> exports) {
    exports->Set(String::NewSymbol("command"), FunctionTemplate::New(Controls)->GetFunction());
}
NODE_MODULE(mediaWMplayerControls, Init)



