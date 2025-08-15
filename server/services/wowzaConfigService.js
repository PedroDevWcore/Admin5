import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

class WowzaConfigService {
  constructor() {
    this.wowzaBasePath = '/usr/local/WowzaStreamingEngine-4.8.0/conf';
  }

  /**
   * Cria os arquivos de configuração do Wowza para uma revenda/streaming
   * @param {Object} config - Configurações da revenda/streaming
   * @param {string} config.nome - Nome da revenda (ex: pedrowcore2)
   * @param {string} config.serverIp - IP do servidor
   * @param {number} config.bitrate - Bitrate máximo
   * @param {number} config.espectadores - Número máximo de espectadores
   * @param {string} config.senha - Senha para publicação
   */
  async createWowzaConfig(config) {
    const { nome, serverIp, bitrate = 4500, espectadores = 999999, senha } = config;
    
    try {
      // Criar diretório da aplicação
      const appDir = path.join(this.wowzaBasePath, nome);
      await this.createDirectory(appDir, serverIp);

      // Criar os 4 arquivos necessários
      await Promise.all([
        this.createApplicationXml(appDir, nome, bitrate, espectadores, serverIp),
        this.createPublishPassword(appDir, nome, senha, serverIp),
        this.createAliasMapPlay(appDir, nome, serverIp),
        this.createAliasMapStream(appDir, nome, serverIp)
      ]);

      // Criar diretório de streaming no home
      const streamingDir = `/home/streaming/${nome}`;
      await this.createDirectory(streamingDir, serverIp);

      console.log(`✅ Configuração Wowza criada com sucesso para: ${nome}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao criar configuração Wowza para ${nome}:`, error);
      throw error;
    }
  }

  /**
   * Remove os arquivos de configuração do Wowza
   */
  async removeWowzaConfig(nome, serverIp) {
    try {
      const appDir = path.join(this.wowzaBasePath, nome);
      const streamingDir = `/home/streaming/${nome}`;
      
      await this.executeSSHCommand(`rm -rf ${appDir}`, serverIp);
      await this.executeSSHCommand(`rm -rf ${streamingDir}`, serverIp);
      
      console.log(`✅ Configuração Wowza removida com sucesso para: ${nome}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao remover configuração Wowza para ${nome}:`, error);
      throw error;
    }
  }

  /**
   * Cria um diretório no servidor SSH
   */
  async createDirectory(dirPath, serverIp) {
    const command = `mkdir -p ${dirPath}`;
    await this.executeSSHCommand(command, serverIp);
  }

  /**
   * Cria o arquivo Application.xml
   */
  async createApplicationXml(appDir, nome, bitrate, espectadores, serverIp) {
    const content = `<?xml version="1.0" encoding="UTF-8"?>
<Root version="1">
	<Application>
		<Name>${nome}</Name>
		<AppType>Live</AppType>
		<Description>Default application for live streaming created when Wowza Streaming Engine is installed. Use this application with its default configuration or modify the configuration as needed. You can also copy it to create another live application.</Description>
		<!-- Uncomment to set application level timeout values
		<ApplicationTimeout>60000</ApplicationTimeout>
		<PingTimeout>12000</PingTimeout>
		<ValidationFrequency>800</ValidationFrequency>
		<MaximumPendingWriteBytes>0</MaximumPendingWriteBytes>
		<MaximumSetBufferTime>60000</MaximumSetBufferTime>
		<MaximumStorageDirDepth>25</MaximumStorageDirDepth>
		-->
		<Connections>
			<AutoAccept>true</AutoAccept>
			<AllowDomains></AllowDomains>
		</Connections>
		<!--
			StorageDir path variables
			\${com.wowza.wms.AppHome} - Application home directory
			\${com.wowza.wms.ConfigHome} - Configuration home directory
			\${com.wowza.wms.context.VHost} - Virtual host name
			\${com.wowza.wms.context.VHostConfigHome} - Virtual host config directory
			\${com.wowza.wms.context.Application} - Application name
			\${com.wowza.wms.context.ApplicationInstance} - Application instance name
		-->
		<Streams>
			<StreamType>live</StreamType>
			<StorageDir>/home/streaming/${nome}</StorageDir>
			<KeyDir>\${com.wowza.wms.context.VHostConfigHome}/keys</KeyDir>
			<!-- LiveStreamPacketizers (separate with commas): cupertinostreamingpacketizer, smoothstreamingpacketizer, sanjosestreamingpacketizer, mpegdashstreamingpacketizer, cupertinostreamingrepeater, smoothstreamingrepeater, sanjosestreamingrepeater, mpegdashstreamingrepeater -->
			<LiveStreamPacketizers>cupertinostreamingpacketizer, mpegdashstreamingpacketizer, sanjosestreamingpacketizer, smoothstreamingpacketizer</LiveStreamPacketizers>
			<!-- Properties defined here will override any properties defined in conf/Streams.xml for any streams types loaded by this application -->
			<Properties>
			</Properties>
		</Streams>
		<Transcoder>
			<!-- To turn on transcoder set to: transcoder -->
			<LiveStreamTranscoder></LiveStreamTranscoder>
			<!-- [templatename].xml or \${SourceStreamName}.xml -->
			<Templates>\${SourceStreamName}.xml,transrate.xml</Templates>
			<ProfileDir>\${com.wowza.wms.context.VHostConfigHome}/transcoder/profiles</ProfileDir>
			<TemplateDir>\${com.wowza.wms.context.VHostConfigHome}/transcoder/templates</TemplateDir>
			<Properties>
			</Properties>
		</Transcoder>
		<DVR>
			<!-- As a single server or as an origin, use dvrstreamingpacketizer in LiveStreamPacketizers above -->
			<!-- Or, in an origin-edge configuration, edges use dvrstreamingrepeater in LiveStreamPacketizers above -->
			<!-- As an origin, also add dvrchunkstreaming to HTTPStreamers below -->
			<!-- If this is a dvrstreamingrepeater, define Application/Repeater/OriginURL to point back to the origin -->
			<!-- To turn on DVR recording set Recorders to dvrrecorder.  This works with dvrstreamingpacketizer  -->
			<Recorders></Recorders>
			<!-- As a single server or as an origin, set the Store to dvrfilestorage-->
			<!-- edges should have this empty -->
			<Store></Store>
			<!--  Window Duration is length of live DVR window in seconds.  0 means the window is never trimmed. -->
			<WindowDuration>0</WindowDuration>
			<!-- Storage Directory is top level location where dvr is stored.  e.g. c:/temp/dvr -->
			<StorageDir>\${com.wowza.wms.context.VHostConfigHome}/dvr</StorageDir>
			<!-- valid ArchiveStrategy values are append, version, delete -->
			<ArchiveStrategy>append</ArchiveStrategy>
			<!-- Properties for DVR -->
			<Properties>
			</Properties>
		</DVR>
		<TimedText>
			<!-- VOD caption providers (separate with commas): vodcaptionprovidermp4_3gpp, vodcaptionproviderttml, vodcaptionproviderwebvtt,  vodcaptionprovidersrt, vodcaptionproviderscc -->
			<VODTimedTextProviders></VODTimedTextProviders>
			<!-- Properties for TimedText -->
			<Properties>
			</Properties>
		</TimedText>
		<!-- HTTPStreamers (separate with commas): cupertinostreaming, smoothstreaming, sanjosestreaming, mpegdashstreaming, dvrchunkstreaming -->
		<HTTPStreamers>cupertinostreaming, smoothstreaming, sanjosestreaming, mpegdashstreaming</HTTPStreamers>
		<MediaCache>
			<MediaCacheSourceList></MediaCacheSourceList>
		</MediaCache>
		<SharedObjects>
			<StorageDir>\${com.wowza.wms.context.VHostConfigHome}/applications/\${com.wowza.wms.context.Application}/sharedobjects/\${com.wowza.wms.context.ApplicationInstance}</StorageDir>
		</SharedObjects>
		<Client>
			<IdleFrequency>-1</IdleFrequency>
			<Access>
				<StreamReadAccess>*</StreamReadAccess>
				<StreamWriteAccess>*</StreamWriteAccess>
				<StreamAudioSampleAccess></StreamAudioSampleAccess>
				<StreamVideoSampleAccess></StreamVideoSampleAccess>
				<SharedObjectReadAccess>*</SharedObjectReadAccess>
				<SharedObjectWriteAccess>*</SharedObjectWriteAccess>
			</Access>
		</Client>
		<RTP>
			<!-- RTP/Authentication/[type]Methods defined in Authentication.xml. Default setup includes; none, basic, digest -->
			<Authentication>
				<PublishMethod>digest</PublishMethod>
				<PlayMethod>none</PlayMethod>
			</Authentication>
			<!-- RTP/AVSyncMethod. Valid values are: senderreport, systemclock, rtptimecode -->
			<AVSyncMethod>senderreport</AVSyncMethod>
			<MaxRTCPWaitTime>12000</MaxRTCPWaitTime>
			<IdleFrequency>75</IdleFrequency>
			<RTSPSessionTimeout>90000</RTSPSessionTimeout>
			<RTSPMaximumPendingWriteBytes>0</RTSPMaximumPendingWriteBytes>
			<RTSPBindIpAddress></RTSPBindIpAddress>
			<RTSPConnectionIpAddress>0.0.0.0</RTSPConnectionIpAddress>
			<RTSPOriginIpAddress>127.0.0.1</RTSPOriginIpAddress>
			<IncomingDatagramPortRanges>*</IncomingDatagramPortRanges>
			<!-- Properties defined here will override any properties defined in conf/RTP.xml for any depacketizers loaded by this application -->
			<Properties>
			</Properties>
		</RTP>
		<WebRTC>
			<EnablePublish>true</EnablePublish>
			<EnablePlay>true</EnablePlay>
			<EnableQuery>true</EnableQuery>
			<IceCandidateIpAddresses>${serverIp},tcp,1935</IceCandidateIpAddresses>
			<UDPBindAddress></UDPBindAddress>
			<PreferredCodecsAudio>opus,vorbis,pcmu,pcma</PreferredCodecsAudio>
			<PreferredCodecsVideo>vp8,h264</PreferredCodecsVideo>
			<DebugLog>false</DebugLog>
			<Properties>
			</Properties>
		</WebRTC>
		<MediaCaster>
			<RTP>
				<RTSP>
					<!-- udp, interleave -->
					<RTPTransportMode>interleave</RTPTransportMode>
				</RTSP>
			</RTP>
			<StreamValidator>
				<Enable>true</Enable>
				<ResetNameGroups>true</ResetNameGroups>
				<StreamStartTimeout>20000</StreamStartTimeout>
				<StreamTimeout>12000</StreamTimeout>
				<VideoStartTimeout>0</VideoStartTimeout>
				<VideoTimeout>0</VideoTimeout>
				<AudioStartTimeout>0</AudioStartTimeout>
				<AudioTimeout>0</AudioTimeout>
				<VideoTCToleranceEnable>false</VideoTCToleranceEnable>
				<VideoTCPosTolerance>3000</VideoTCPosTolerance>
				<VideoTCNegTolerance>-500</VideoTCNegTolerance>
				<AudioTCToleranceEnable>false</AudioTCToleranceEnable>
				<AudioTCPosTolerance>3000</AudioTCPosTolerance>
				<AudioTCNegTolerance>-500</AudioTCNegTolerance>
				<DataTCToleranceEnable>false</DataTCToleranceEnable>
				<DataTCPosTolerance>3000</DataTCPosTolerance>
				<DataTCNegTolerance>-500</DataTCNegTolerance>
				<AVSyncToleranceEnable>false</AVSyncToleranceEnable>
				<AVSyncTolerance>1500</AVSyncTolerance>
				<DebugLog>false</DebugLog>
			</StreamValidator>
			<!-- Properties defined here will override any properties defined in conf/MediaCasters.xml for any MediaCasters loaded by this applications -->
			<Properties>
			</Properties>
		</MediaCaster>
		<MediaReader>
			<!-- Properties defined here will override any properties defined in conf/MediaReaders.xml for any MediaReaders loaded by this applications -->
			<Properties>
			</Properties>
		</MediaReader>
		<MediaWriter>
			<!-- Properties defined here will override any properties defined in conf/MediaWriter.xml for any MediaWriter loaded by this applications -->
			<Properties>
			</Properties>
		</MediaWriter>
		<LiveStreamPacketizer>
			<!-- Properties defined here will override any properties defined in conf/LiveStreamPacketizers.xml for any LiveStreamPacketizers loaded by this applications -->
			<Properties>
			</Properties>
		</LiveStreamPacketizer>
		<HTTPStreamer>
			<!-- Properties defined here will override any properties defined in conf/HTTPStreamers.xml for any HTTPStreamer loaded by this applications -->
			<Properties>
                <Property>
                <Name>cupertinoPlaylistProgramId</Name>
                <Value>1</Value>
                <Type>Integer</Type>
                </Property>
			</Properties>
		</HTTPStreamer>
		<HTTPProvider>
	<BaseClass>com.wowza.wms.plugin.HTTPStreamControl</BaseClass>
	<RequestFilters>streamcontrol*</RequestFilters>
	<AuthenticationMethod>none</AuthenticationMethod>
</HTTPProvider>
		<Manager>
			<!-- Properties defined are used by the Manager -->
			<Properties>
			</Properties>
		</Manager>
		<Repeater>
			<OriginURL></OriginURL>
			<QueryString><![CDATA[]]></QueryString>
		</Repeater>
		<StreamRecorder>
			<Properties>
			</Properties>
		</StreamRecorder>
		<Modules>
			<Module>
				<Name>base</Name>
				<Description>Base</Description>
				<Class>com.wowza.wms.module.ModuleCore</Class>
			</Module>
			<Module>
				<Name>logging</Name>
				<Description>Client Logging</Description>
				<Class>com.wowza.wms.module.ModuleClientLogging</Class>
			</Module>
			<Module>
				<Name>flvplayback</Name>
				<Description>FLVPlayback</Description>
				<Class>com.wowza.wms.module.ModuleFLVPlayback</Class>
			</Module>
			<Module>
				<Name>ModuleCoreSecurity</Name>
				<Description>Core Security Module for Applications</Description>
				<Class>com.wowza.wms.security.ModuleCoreSecurity</Class>
			</Module>
			<Module>
				<Name>streamPublisher</Name>
				<Description>Playlists</Description>
				<Class>com.wowza.wms.plugin.streampublisher.ModuleStreamPublisher</Class>
			</Module>
           <Module>
				<Name>ModuleLoopUntilLive</Name>
				<Description>ModuleLoopUntilLive</Description>
				<Class>com.wowza.wms.plugin.streampublisher.ModuleLoopUntilLive</Class>
			</Module>
			<Module>
                <Name>ModuleLimitPublishedStreamBandwidth</Name>
                <Description>Monitors limit of published stream bandwidth.</Description>
                <Class>com.wowza.wms.plugin.ModuleLimitPublishedStreamBandwidth</Class>
            </Module>
			<Module>
                    <Name>ModulePushPublish</Name>
                    <Description>ModulePushPublish</Description>
                    <Class>com.wowza.wms.pushpublish.module.ModulePushPublish</Class>
            </Module>
		</Modules>
		<!-- Properties defined here will be added to the IApplication.getProperties() and IApplicationInstance.getProperties() collections -->
		<Properties>
			<Property>
				<Name>limitPublishedStreamBandwidthMaxBitrate</Name>
				<Value>${bitrate}</Value>
				<Type>Integer</Type>
			</Property>
			<Property>
				<Name>limitPublishedStreamBandwidthDebugLog</Name>
				<Value>true</Value>
				<Type>Boolean</Type>
			</Property>
			<Property>
				<Name>MaxBitrate</Name>
				<Value>${bitrate}</Value>
				<Type>Integer</Type>
			</Property>
			<Property>
				<Name>StreamMonitorLogging</Name>
				<Value>true</Value>
				<Type>Boolean</Type>
			</Property>
			<Property>
				<Name>limitStreamViewersMaxViewers</Name>
				<Value>${espectadores}</Value>
				<Type>Integer</Type>
			</Property>
			<Property>
				<Name>securityPlayMaximumConnections</Name>
				<Value>${espectadores}</Value>
				<Type>Integer</Type>
			</Property>
			<Property>
				<Name>securityPublishRequirePassword</Name>
				<Value>true</Value>
				<Type>Boolean</Type>
			</Property>
			<Property>
				<Name>streamPublisherSmilFile</Name>
				<Value>playlists_agendamentos.smil</Value>
				<Type>String</Type>
			</Property>
			<Property>
				<Name>streamPublisherPassMetaData</Name>
				<Value>true</Value>
				<Type>Boolean</Type>
			</Property>
			<Property>
				<Name>streamPublisherSwitchLog</Name>
				<Value>true</Value>
				<Type>Boolean</Type>
			</Property>
			<Property>
				<Name>securityPublishBlockDuplicateStreamNames</Name>
				<Value>false</Value>
				<Type>Boolean</Type>
			</Property>
			<Property>
				<Name>securityPublishPasswordFile</Name>
				<Value>\${com.wowza.wms.context.VHostConfigHome}/conf/\${com.wowza.wms.context.Application}/publish.password</Value>
				<Type>String</Type>
			</Property>
			<Property>
				<Name>loopUntilLiveSourceStreams</Name>
				<Value>live</Value>
				<Type>String</Type>
			</Property>
			<Property>
				<Name>loopUntilLiveOutputStreams</Name>
				<Value>${nome}</Value>
				<Type>String</Type>
			</Property>
			<Property>
				<Name>loopUntilLiveReloadEntirePlaylist</Name>
				<Value>true</Value>
				<Type>Boolean</Type>
			</Property>
			<Property>
				<Name>loopUntilLiveHandleMediaCasters</Name>
				<Value>false</Value>
				<Type>Boolean</Type>
			</Property>
			<Property>
                <Name>pushPublishMapPath</Name>
                <Value>\${com.wowza.wms.context.VHostConfigHome}/conf/\${com.wowza.wms.context.Application}/PushPublishMap.txt</Value>
                <Type>String</Type>
            </Property>
		</Properties>
	</Application>
</Root>`;

    const filePath = path.join(appDir, 'Application.xml');
    await this.writeFileToServer(filePath, content, serverIp);
  }

  /**
   * Cria o arquivo publish.password
   */
  async createPublishPassword(appDir, nome, senha, serverIp) {
    const content = `${nome}=${senha}
*=\${Stream.Name}`;

    const filePath = path.join(appDir, 'publish.password');
    await this.writeFileToServer(filePath, content, serverIp);
  }

  /**
   * Cria o arquivo aliasmap.play.txt
   */
  async createAliasMapPlay(appDir, nome, serverIp) {
    const content = `${nome} teste2026`;

    const filePath = path.join(appDir, 'aliasmap.play.txt');
    await this.writeFileToServer(filePath, content, serverIp);
  }

  /**
   * Cria o arquivo aliasmap.stream.txt
   */
  async createAliasMapStream(appDir, nome, serverIp) {
    const content = `${nome} teste2026`;

    const filePath = path.join(appDir, 'aliasmap.stream.txt');
    await this.writeFileToServer(filePath, content, serverIp);
  }

  /**
   * Escreve um arquivo no servidor via SSH
   */
  async writeFileToServer(filePath, content, serverIp) {
    // Escapar aspas e caracteres especiais no conteúdo
    const escapedContent = content.replace(/'/g, "'\"'\"'");
    
    const command = `echo '${escapedContent}' > ${filePath}`;
    await this.executeSSHCommand(command, serverIp);
  }

  /**
   * Executa um comando SSH no servidor
   */
  async executeSSHCommand(command, serverIp) {
    try {
      // Buscar dados do servidor no banco
      const serverData = await this.getServerData(serverIp);
      if (!serverData) {
        throw new Error(`Servidor não encontrado: ${serverIp}`);
      }

      const sshCommand = `sshpass -p '${serverData.senha_root}' ssh -o StrictHostKeyChecking=no -p ${serverData.porta_ssh} root@${serverIp} "${command}"`;
      
      const { stdout, stderr } = await execAsync(sshCommand);
      
      if (stderr && !stderr.includes('Warning')) {
        console.warn(`SSH Warning: ${stderr}`);
      }
      
      return stdout;
    } catch (error) {
      console.error(`Erro ao executar comando SSH: ${command}`, error);
      throw error;
    }
  }

  /**
   * Busca dados do servidor no banco de dados
   */
  async getServerData(serverIp) {
    try {
      // Importar pool aqui para evitar dependência circular
      const { pool } = await import('../config/database.js');
      
      const [servers] = await pool.execute(
        'SELECT senha_root, porta_ssh FROM wowza_servers WHERE ip = ? AND status = "ativo"',
        [serverIp]
      );

      return servers[0] || null;
    } catch (error) {
      console.error('Erro ao buscar dados do servidor:', error);
      throw error;
    }
  }

  /**
   * Atualiza configuração existente (bitrate, espectadores, etc.)
   */
  async updateWowzaConfig(nome, serverIp, updates) {
    try {
      const appDir = path.join(this.wowzaBasePath, nome);
      const applicationXmlPath = path.join(appDir, 'Application.xml');
      
      // Verificar se o arquivo existe
      const checkCommand = `test -f ${applicationXmlPath} && echo "exists" || echo "not found"`;
      const result = await this.executeSSHCommand(checkCommand, serverIp);
      
      if (result.trim() === 'not found') {
        throw new Error(`Configuração não encontrada para: ${nome}`);
      }

      // Atualizar valores específicos no XML
      if (updates.bitrate) {
        await this.updateXmlValue(applicationXmlPath, 'limitPublishedStreamBandwidthMaxBitrate', updates.bitrate, serverIp);
        await this.updateXmlValue(applicationXmlPath, 'MaxBitrate', updates.bitrate, serverIp);
      }

      if (updates.espectadores) {
        await this.updateXmlValue(applicationXmlPath, 'limitStreamViewersMaxViewers', updates.espectadores, serverIp);
        await this.updateXmlValue(applicationXmlPath, 'securityPlayMaximumConnections', updates.espectadores, serverIp);
      }

      console.log(`✅ Configuração Wowza atualizada com sucesso para: ${nome}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao atualizar configuração Wowza para ${nome}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza um valor específico no arquivo XML
   */
  async updateXmlValue(filePath, propertyName, newValue, serverIp) {
    const command = `sed -i 's|<Name>${propertyName}</Name>.*<Value>.*</Value>|<Name>${propertyName}</Name>\\n\\t\\t\\t\\t<Value>${newValue}</Value>|g' ${filePath}`;
    await this.executeSSHCommand(command, serverIp);
  }
}

export const wowzaConfigService = new WowzaConfigService();